import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable validation and transformation pipes for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enables class-transformer's @Transform
      whitelist: true, // Strips fields not in DTO
      forbidNonWhitelisted: true, // Throws error on extra field
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
