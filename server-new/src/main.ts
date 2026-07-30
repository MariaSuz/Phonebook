import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//Преобразум для файлов
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    app.enableCors({
      origin: (origin, callback) => {
        if (
          !origin ||
          origin.startsWith('http://localhost') ||
          /^http:\/\/192\.168\.1\.\d+$/.test(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error('Доступ запрещен'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Disposition'],
    });
  } else {
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Disposition'],
    });
  }

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
