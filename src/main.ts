import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 정적 파일 서빙 설정 (public 폴더를 /static 경로로)
  app.use('/static', express.static(join(__dirname, '..', 'public')));

  // CORS 설정
  app.enableCors();

  // 글로벌 프리픽스 설정 - 모든 API가 /hackathon으로 시작
  app.setGlobalPrefix('hackathon');

  // 글로벌 파이프 설정
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  console.log(
    `Character Image API: http://localhost:${port}/hackathon/characters`,
  );
}
bootstrap();
