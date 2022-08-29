import { Provider } from '@nestjs/common';
import { TOKENS } from '@shared/constants';
import { PrismaScansMangasRepository } from './implementations/prisma-scans-mangas.repository';
import { PrismaScansRepository } from './implementations/prisma-scans.repository';

export const repositories: Provider[] = [
  {
    provide: TOKENS.SCANS_REPOSITORY,
    useClass: PrismaScansRepository,
  },
  {
    provide: TOKENS.SCANS_MANGAS_REPOSITORY,
    useClass: PrismaScansMangasRepository,
  },
  PrismaScansMangasRepository,
];
