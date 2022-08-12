import { Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AccountsModule } from '@modules/accounts/accounts.module';

import * as Services from './services';
import * as Strategies from './strategies';

const servicesProviders: Provider[] = [...Object.values(Services)];
const strategiesProviders: Provider[] = [...Object.values(Strategies)];

@Module({
  imports: [AccountsModule, PassportModule],
  providers: [...servicesProviders, ...strategiesProviders],
})
export class AuthModule {}
