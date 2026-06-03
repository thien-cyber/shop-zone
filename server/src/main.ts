import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt bảo mật Headers bằng Helmet
  app.use(helmet());

  // Kích hoạt Cookie Parser (Bắt buộc phải có để đọc/ghi HttpOnly Cookie)
  app.use(cookieParser());

  // Cấu hình CORS nghiêm ngặt (Thay URL frontend của bạn vào đây khi deploy)
  app.enableCors({
    origin: true, // Cho phép trong môi trường local dev, production nên chỉ định domain cụ thể
    credentials: true, // Bắt buộc bằng true để cho phép truyền nhận HttpOnly Cookie
  });

  // Kích hoạt Validation toàn hệ thống cho DTO đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường thừa không được định nghĩa trong DTO
      transform: true, // Tự động convert kiểu dữ liệu phù hợp trong DTO
    }),
  );

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
