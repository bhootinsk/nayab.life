import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const corsOrigin = config.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  app.enableCors({ origin: corsOrigin.split(',').map((s) => s.trim()), credentials: true });

  const contentRoot = config.get<string>('CONTENT_ROOT') || join(process.cwd(), '../..');
  app.useStaticAssets(join(contentRoot, 'uploads'), { prefix: '/uploads' });

  const port = config.get<number>('PORT') || 4000;
  await app.listen(port);
  console.log(`NestJS API listening on http://localhost:${port}/api`);
}
bootstrap();
