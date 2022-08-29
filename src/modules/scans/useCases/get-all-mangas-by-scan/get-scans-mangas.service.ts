import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { TOKENS } from '@shared/constants';

import { ScanMangasDetails } from '@modules/scans/dtos';
import { IScansMangasRepository } from '@modules/scans/repositories/models';
import { SearchParams, SearchResult } from '@shared/dtos';

@Injectable()
export class GetAllMangasByScan
  implements UseCase<GetAllMangasByScan.Input, GetAllMangasByScan.Output>
{
  constructor(
    @Inject(TOKENS.SCANS_MANGAS_REPOSITORY)
    private readonly scansMangasRepository: IScansMangasRepository,
  ) {}

  async execute({
    page = 1,
    perPage = 20,
    query,
    scan,
  }: GetAllMangasByScan.Input): Promise<GetAllMangasByScan.Output> {
    const { data, totalCount } =
      await this.scansMangasRepository.findManyMangasByScan({
        page,
        scan,
        perPage,
        query,
      });

    return { data, totalCount };
  }
}

export namespace GetAllMangasByScan {
  export type Input = {
    scan: string;
  } & SearchParams;

  export type Output = SearchResult<ScanMangasDetails>;
}
