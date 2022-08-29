import { Module, Provider } from '@nestjs/common';
import { TOKENS } from '@shared/constants';

import { repositories } from './repositories';
import * as UseCases from './useCases';

const useCasesProviders: Provider[] = [...Object.values(UseCases)];

@Module({
  providers: [...useCasesProviders, ...repositories],
  exports: [
    ...useCasesProviders,
    TOKENS.MANGAS_REPOSITORY,
    TOKENS.CHAPTERS_REPOSITORY,
  ],
})
export class MangaModule {}
