import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
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
  app.use(compression());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    credentials: true,
    origin: true,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/test', app, document);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
