import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';

import { ChapterWithDetails } from '@modules/mangas/dtos';
import { IChaptersRepository } from '@modules/mangas/repositories/models';
import { TOKENS } from '@shared/constants';

@Injectable()
export class ListAllChapters
  implements UseCase<ListAllChapters.Request, ListAllChapters.Response>
{
  constructor(
    @Inject(TOKENS.CHAPTERS_REPOSITORY)
    private readonly chaptersRepository: IChaptersRepository,
  ) {}

  async execute({
    slug,
  }: ListAllChapters.Request): Promise<ListAllChapters.Response> {
    const chapter = await this.chaptersRepository.findManyByManga(slug);

    return chapter;
  }
}

export namespace ListAllChapters {
  export type Request = {
    slug: string;
  };

  export type Response = ChapterWithDetails[];
}
