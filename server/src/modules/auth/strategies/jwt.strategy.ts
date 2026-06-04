import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Đọc Access Token dạng Bearer Token ở Header
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') ||
        'access_secret_key_2026',
    });
  }

  async validate(payload: any) {
    // Trả về dữ liệu đính kèm vào req.user cho các API sau sử dụng
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
