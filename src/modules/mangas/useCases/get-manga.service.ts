import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { ErrorMessages } from '@shared/errors';

import { MangaWithDetails } from '@modules/mangas/dtos';
import { IMangasRepository } from '@modules/mangas/repositories/models';
import { TOKENS } from '@shared/constants';

@Injectable()
export class GetManga implements UseCase<GetManga.Request, GetManga.Response> {
  constructor(
    @Inject(TOKENS.MANGAS_REPOSITORY)
    private readonly mangasRepository: IMangasRepository,
  ) {}

  async execute({ slug }: GetManga.Request): Promise<GetManga.Response> {
    const manga = await this.mangasRepository.findBySlugWithDetails(slug);

    if (!manga) {
      throw new NotFoundException(ErrorMessages.MANGA_DOES_NOT_EXISTS);
    }

    return manga;
  }
}

export namespace GetManga {
  export type Request = {
    slug: string;
  };

  export type Response = MangaWithDetails;
}
