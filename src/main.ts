import { join } from 'path';

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@infra/http/filters';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get('PORT');
  const APP_ROUTE_PREFIX = 'api';

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })
    .setGlobalPrefix(APP_ROUTE_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Documentação')
    .setDescription('Api de mangás da Nix Mangás')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`docs`, app, document);

  app.useStaticAssets(join(__dirname, '..', 'tmp'));

  await app.listen(PORT);

  console.log(`Running at http://localhost:${PORT}`);
}
bootstrap();
