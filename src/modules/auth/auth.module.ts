import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccountsModule } from '@modules/accounts/accounts.module';

import { ScansModule } from '@modules/scans/scans.module';
import { jwtConstants } from '@shared/constants';
import * as Services from './services';
import * as Strategies from './strategies';
import * as UseCases from './usecases';

const useCases: Provider[] = [...Object.values(UseCases)];

@Module({
  imports: [
    AccountsModule,
    ScansModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    ...useCases,
    ...Object.values(Strategies),
    ...Object.values(Services),
  ],
  exports: [...useCases],
})
export class AuthModule {}
