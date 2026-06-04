import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Đăng ký người dùng mới
  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email này đã được sử dụng trên hệ thống');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      email,
      passwordHash,
      fullName,
    });

    const savedUser = await this.userRepository.save(newUser);
    const { passwordHash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // Xác thực người dùng khi đăng nhập
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && user.isActive && user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user; // Loại bỏ passwordHash khỏi đối tượng trả về
        return result as User;
      }
    }

    return null;
  }

  // Xử lý đăng nhập, sinh Access Token và Refresh Token
  async login(user: User, ipAddress: string, userAgent: string) {
    if (!user) throw new Error('Invalid user');
    const payload = { email: user.email, sub: user.id, role: user.role };

    // Sinh Access Token (hạn ngắn)
    const accessToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_ACCESS_SECRET') ||
        'access_secret_key_2026',
      expiresIn: '15m',
    });

    // Sinh Refresh Token ngẫu nhiên không trùng lặp (hạn dài)
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(rawRefreshToken)
      .digest('hex');

    // Lưu phiên Refresh Token xuống Database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Hạn 7 ngày

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
      ipAddress,
      userAgent,
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      rawRefreshToken, // Trả về dạng raw để Controller găm vào HttpOnly Cookie
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  // Logic Xoay vòng token (Refresh Token)
  async refresh(rawRefreshToken: string, ipAddress: string, userAgent: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawRefreshToken)
      .digest('hex');

    // Tìm mã hash trong DB kèm thông tin User
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { tokenHash, isRevoked: false },
      relations: { user: true },
    });

    if (
      !tokenEntity ||
      tokenEntity.expiresAt < new Date() ||
      !tokenEntity.user.isActive
    ) {
      throw new UnauthorizedException(
        'Phiên làm việc không hợp lệ hoặc đã hết hạn',
      );
    }

    // Thu hồi (Revoke) token cũ ngay lập tức (Xoay vòng token nâng cao)
    tokenEntity.isRevoked = true;
    await this.refreshTokenRepository.save(tokenEntity);

    // Tiến hành cấp bộ đôi token mới hoàn toàn (Xoay vòng bảo mật)
    return this.login(tokenEntity.user, ipAddress, userAgent);
  }

  // Logic Đăng xuất (Thu hồi token của thiết bị hiện tại)
  async logout(rawRefreshToken: string) {
    if (!rawRefreshToken) return;
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawRefreshToken)
      .digest('hex');
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });
    if (tokenEntity) {
      tokenEntity.isRevoked = true;
      await this.refreshTokenRepository.save(tokenEntity);
    }
  }
}
