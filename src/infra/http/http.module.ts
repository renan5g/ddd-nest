import { Module, Provider } from '@nestjs/common';

import { ControllerType } from '@shared/types';

import { PrismaModule } from '@infra/prisma';
import { AccountsModule } from '@modules/accounts/accounts.module';
import { AuthModule } from '@modules/auth/auth.module';

import * as v1Routes from '@infra/http/routes/v1';
import * as Guards from './guards';

const guardsProvider: Provider[] = [...Object.values(Guards)];
const routesController: ControllerType = [...Object.values(v1Routes)];

@Module({
  imports: [PrismaModule, AccountsModule, AuthModule],
  providers: [...guardsProvider],
  controllers: [...routesController],
})
export class HttpModule {}
