import { Module, Provider } from '@nestjs/common';

import { repositories } from './repositories';
import * as UseCases from './usecases';

const exposedProviders: Provider[] = [
  ...Object.values(UseCases),
  repositories[0],
];

@Module({
  providers: [...repositories, ...exposedProviders],
  exports: [...exposedProviders],
})
export class AccountsModule {}
