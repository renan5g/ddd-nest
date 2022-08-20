import { StorageModule } from '@infra/providers/storage/storage.module';
import { Module, Provider } from '@nestjs/common';
import { TOKENS } from '@shared/constants';

import { PrismaUsersRepository } from './repositories/implementations/prisma';

import * as UseCases from './usecases';

const useCases: Provider[] = [...Object.values(UseCases)];

export const repositories: Provider[] = [
  {
    provide: TOKENS.USERS_REPOSITORY,
    useClass: PrismaUsersRepository,
  },
];

@Module({
  imports: [StorageModule],
  providers: [...useCases, ...repositories],
  exports: [...useCases, TOKENS.USERS_REPOSITORY],
})
export class AccountsModule {}
