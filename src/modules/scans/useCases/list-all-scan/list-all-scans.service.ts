import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { TOKENS } from '@shared/constants';

import { ScanWithDetails } from '@modules/scans/dtos';
import { IScansRepository } from '@modules/scans/repositories/models';
import { SearchParams, SearchResult } from '@shared/dtos';

@Injectable()
export class ListAllScans
  implements UseCase<ListAllScans.Input, ListAllScans.Output>
{
  constructor(
    @Inject(TOKENS.SCANS_REPOSITORY)
    private readonly scansRepository: IScansRepository,
  ) {}

  async execute({
    query,
    page = 1,
    perPage = 20,
  }: ListAllScans.Input): Promise<ListAllScans.Output> {
    const scans = await this.scansRepository.findMany({
      query,
      page,
      perPage,
    });

    return scans;
  }
}

export namespace ListAllScans {
  export type Input = SearchParams;

  export type Output = SearchResult<ScanWithDetails>;
}
