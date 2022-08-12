import * as express from 'express';
import { join } from 'path';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Documentação do sistema QrCard')
    .setDescription('Api validador do sistema QrCard')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use('/docs', express.static(process.cwd() + 'docs'));
  app.useStaticAssets(join(__dirname, '..', 'tmp'));

  await app.listen(3000);
}
bootstrap();
