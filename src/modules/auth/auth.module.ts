import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccountsModule } from '@modules/accounts/accounts.module';
import { jwtConstants } from '@shared/constants';

import * as Services from './services';
import * as Strategies from './strategies';
import * as UseCases from './usecases';

const exposedProviders: Provider[] = [...Object.values(UseCases)];

@Module({
  imports: [
    AccountsModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    ...exposedProviders,
    ...Object.values(Strategies),
    ...Object.values(Services),
  ],
  exports: [...exposedProviders],
})
export class AuthModule {}
