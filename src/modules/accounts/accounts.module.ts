import { Module, Provider } from '@nestjs/common';

import { repositories } from './repositories';
import * as UseCases from './usecases';

const useCasesProvider: Provider[] = [...Object.values(UseCases)];

@Module({
  providers: [...repositories, ...useCasesProvider],
  exports: [...useCasesProvider, repositories[0]],
})
export class AccountsModule {}
