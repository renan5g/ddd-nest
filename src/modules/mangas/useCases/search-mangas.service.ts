import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';

import { MangaWithDetails } from '@modules/mangas/dtos';
import { IMangasRepository } from '@modules/mangas/repositories/models';
import { TOKENS } from '@shared/constants';
import { SearchParams, SearchResult } from '@shared/dtos';

@Injectable()
export class SearchMangas
  implements UseCase<SearchMangas.Request, SearchMangas.Response>
{
  constructor(
    @Inject(TOKENS.MANGAS_REPOSITORY)
    private readonly mangasRepository: IMangasRepository,
  ) {}

  async execute({
    page = 1,
    perPage = 20,
    query,
  }: SearchMangas.Request): Promise<SearchMangas.Response> {
    const { data, totalCount } = await this.mangasRepository.search({
      page,
      perPage,
      query,
    });

    return { data, totalCount };
  }
}

export namespace SearchMangas {
  export type Request = SearchParams;

  export type Response = SearchResult<MangaWithDetails>;
}
