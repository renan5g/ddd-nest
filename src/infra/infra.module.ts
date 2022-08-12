import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { PrismaModule } from '@infra/prisma';

@Module({
  imports: [PrismaModule, HttpModule],
})
export class InfraModule {}
