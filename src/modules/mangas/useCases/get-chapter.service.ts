import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { ErrorMessages } from '@shared/errors';

import { ChapterWithDetails } from '@modules/mangas/dtos';
import { IChaptersRepository } from '@modules/mangas/repositories/models';
import { TOKENS } from '@shared/constants';

@Injectable()
export class GetChapter
  implements UseCase<GetChapter.Request, GetChapter.Response>
{
  constructor(
    @Inject(TOKENS.CHAPTERS_REPOSITORY)
    private readonly chaptersRepository: IChaptersRepository,
  ) {}

  async execute({
    chapterID,
  }: GetChapter.Request): Promise<GetChapter.Response> {
    const chapter = await this.chaptersRepository.findByIdWithDetails(
      chapterID,
    );

    if (!chapter) {
      throw new NotFoundException(ErrorMessages.CHAPTER_DOES_NOT_EXISTS);
    }

    return chapter;
  }
}

export namespace GetChapter {
  export type Request = {
    chapterID: string;
  };

  export type Response = ChapterWithDetails;
}
