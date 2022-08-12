import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/prisma';
import { AccountsModule } from '@modules/accounts/accounts.module';
import { AuthModule } from '@modules/auth/auth.module';

import * as v1Routes from '@infra/http/routes/v1';
import * as Guards from './guards';

@Module({
  imports: [PrismaModule, AccountsModule, AuthModule],
  providers: [...Object.values(Guards)],
  controllers: [...Object.values(v1Routes)],
})
export class HttpModule {}
