import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. API Đăng ký người dùng mới
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // 2. API Đăng nhập (Xác thực và cấp token)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const ipAddress = (req.ip || '') as string;
    const userAgent = req.headers['user-agent'] || '';

    const result = await this.authService.login(
      req.user as User,
      ipAddress,
      userAgent,
    );

    // Set Refresh Token vào HttpOnly Cookie
    res.cookie('refreshToken', result.rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // 3. API Xoay vòng token (Refresh Token)
  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies['refresh_token'];
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Không tìm thấy mã phiên làm việc');
    }

    const ipAddress = (req.ip || '') as string;
    const userAgent = (req.headers['user-agent'] || '') as string;

    const result = await this.authService.refresh(
      oldRefreshToken,
      ipAddress,
      userAgent,
    );

    // Tiếp tục xoay vòng găm Refresh Token mới vào Cookie
    res.cookie('refresh_token', result.rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // 4. API Đăng xuất (Thu hồi token của thiết bị hiện tại)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    await this.authService.logout(refreshToken);

    // Xóa Cookie ở trình duyệt client
    res.clearCookie('refresh_token');
    return { message: 'Đăng xuất thành công' };
  }

  @Public()
  @Post('google')
  async googleLogin(
    @Body('token') token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException('Mã Token Google không được để trống');
    }

    const ipAddress = (req.ip || '') as string;
    const userAgent = (req.headers['user-agent'] || '') as string;

    const result = await this.authService.loginGoogle(
      token,
      ipAddress,
      userAgent,
    );

    res.cookie('refresh_token', result.rawRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }
}
