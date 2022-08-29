import { MangaModule } from '@modules/mangas/manga.module';
import { Module, Provider } from '@nestjs/common';
import { TOKENS } from '@shared/constants';

import { repositories } from './repositories';
import * as UseCases from './useCases';

const useCasesProviders: Provider[] = [...Object.values(UseCases)];

@Module({
  imports: [MangaModule],
  providers: [...useCasesProviders, ...repositories],
  exports: [...useCasesProviders, TOKENS.SCANS_REPOSITORY],
})
export class ScansModule {}
