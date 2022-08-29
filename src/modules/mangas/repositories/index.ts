import { Provider } from '@nestjs/common';
import { TOKENS } from '@shared/constants';
import { PrismaChaptersRepository } from './implementations/prisma/prisma-chapters.repository';
import { PrismaMangasRepository } from './implementations/prisma/prisma-mangas.repository';
import { PrismaChaptersPagesRepository } from './implementations/prisma/prisma-pages.repository';

export const repositories: Provider[] = [
  {
    provide: TOKENS.MANGAS_REPOSITORY,
    useClass: PrismaMangasRepository,
  },
  {
    provide: TOKENS.CHAPTERS_REPOSITORY,
    useClass: PrismaChaptersRepository,
  },
  {
    provide: TOKENS.CHAPTERS_PAGES_REPOSITORY,
    useClass: PrismaChaptersPagesRepository,
  },
  PrismaChaptersPagesRepository,
];
