import * as express from 'express';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@infra/http/filters/http-exceptions.filter';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  const APP_ROUTE_PREFIX = 'api';

  app.enableCors();
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })
    .setGlobalPrefix(APP_ROUTE_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Documentação do sistema QrCard')
    .setDescription('Api validador do sistema QrCard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`docs`, app, document);

  app.use('docs', express.static(process.cwd() + 'docs'));
  app.useStaticAssets(join(__dirname, '..', 'tmp'));

  await app.listen(3333);

  console.log(`Running at http://localhost:3333`);
}
bootstrap();
