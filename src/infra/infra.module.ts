import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { ProvidersModule } from '@infra/providers/providers.module';

@Module({
  imports: [PrismaModule, HttpModule, ProvidersModule],
})
export class InfraModule {}
