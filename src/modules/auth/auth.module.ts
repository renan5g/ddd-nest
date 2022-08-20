import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccountsModule } from '@modules/accounts/accounts.module';

import * as Services from './services';
import * as Strategies from './strategies';
import * as UseCases from './usecases';

const useCases: Provider[] = [...Object.values(UseCases)];

@Module({
  imports: [
    AccountsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
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
