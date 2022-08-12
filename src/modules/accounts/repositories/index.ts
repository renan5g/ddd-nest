import { Provider } from '@nestjs/common';
import { TOKENS } from '@shared/constants';
import { PrismaUsersRepository } from './implementations/prisma';

export const repositories: Provider[] = [
  {
    provide: TOKENS.USERS_REPOSITORY,
    useClass: PrismaUsersRepository,
  },
];
