import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import '@nestjs/serve-static';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
