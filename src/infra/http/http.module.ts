import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/prisma';

import { AccountsModule } from '@modules/accounts/accounts.module';
import { AuthModule } from '@modules/auth/auth.module';
import { MangaModule } from '@modules/mangas/manga.module';
import { ScansModule } from '@modules/scans/scans.module';

import * as v1Routes from '@infra/http/routes/v1';
import * as Guards from './guards';

@Module({
  imports: [PrismaModule, AuthModule, AccountsModule, ScansModule, MangaModule],
  providers: [...Object.values(Guards)],
  controllers: [...Object.values(v1Routes)],
})
export class HttpModule {}
