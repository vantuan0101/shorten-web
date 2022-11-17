import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Shorten Server Test')
    .setDescription('Shorten Server Test API through Swagger')
    .setVersion('1.0')
    .build();
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // true = only validate fields that are defined in the DTO
    }),
  );
  app.enableCors({
    credentials: true,
    origin: true,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/test', app, document);
  await app.listen(3001);
}
bootstrap();
