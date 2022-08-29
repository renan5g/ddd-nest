import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { Changes, Either, left, Result, right } from '@core/logic';
import { IStorageProvider } from '@infra/providers/storage/models';

import {
  Genre,
  IMangaDemography,
  IMangaType,
  Manga,
  MangaTitle,
} from '@modules/mangas/domain/manga';
import { createManga } from '@modules/mangas/domain/manga/services';
import { IMangasRepository } from '@modules/mangas/repositories/models';
import { TOKENS } from '@shared/constants';
import { rollbackFilesUpload } from '@shared/utils';
import { MangaAlreadyExitsError } from './errors';

@Injectable()
export class CreateManga
  implements UseCase<CreateManga.Request, CreateManga.Response>
{
  private changes: Changes;

  constructor(
    @Inject(TOKENS.STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,
    @Inject(TOKENS.MANGAS_REPOSITORY)
    private readonly mangasRepository: IMangasRepository,
  ) {
    this.changes = new Changes();
  }

  #registerTitles(titles: string[], manga: Manga) {
    const titlesOrErros = titles.map((title) =>
      MangaTitle.create({ value: title }),
    );

    const dtoResult = Result.combine(titlesOrErros);

    if (dtoResult.isFailure) {
      throw new BadRequestException(dtoResult.errorValue());
    }

    const mangaTitles = titlesOrErros.map((title) => title.getValue());

    this.changes.addChange(manga.setAlternativeTitles(mangaTitles));
  }

  #registerGenres(genres: string[], manga: Manga) {
    const genresOrErros = genres.map((genre) => Genre.create({ name: genre }));

    const dtoResult = Result.combine(genresOrErros);

    if (dtoResult.isFailure) {
      throw new BadRequestException(dtoResult.errorValue());
    }

    const mangaGenres = genresOrErros.map((genre) => genre.getValue());

    this.changes.addChange(manga.setGenres(mangaGenres));
  }

  async #setCover(cover: string, folder: string, manga: Manga) {
    const filepath = await this.storageProvider.save(cover, folder);
    this.changes.addChange(manga.changeCoverImg(filepath));
  }

  async #setThumbnail(thumbnail: string, folder: string, manga: Manga) {
    const filepath = await this.storageProvider.save(thumbnail, folder);
    this.changes.addChange(manga.changePosterImg(filepath));
  }

  async execute(params: CreateManga.Request): Promise<CreateManga.Response> {
    const { cover, thumbnail, genres, alternativeTitles, title } = params;

    const mangaAlreadyExists = await this.mangasRepository.exists(title);
    if (mangaAlreadyExists) {
      await rollbackFilesUpload(cover, thumbnail);
      return left(new MangaAlreadyExitsError());
    }

    const mangaOrError = createManga(params);
    if (mangaOrError.isLeft()) {
      await rollbackFilesUpload(cover, thumbnail);
      return left(Result.fail(mangaOrError.value.error));
    }

    const manga = mangaOrError.value;

    if (genres && genres.length > 0) {
      this.#registerGenres(genres, manga);
    }

    if (alternativeTitles && alternativeTitles.length > 0) {
      this.#registerTitles(alternativeTitles, manga);
    }

    const imgPath = `mangas/${manga.slug.value}/covers`;

    if (cover) await this.#setCover(cover, imgPath, manga);
    if (thumbnail) await this.#setThumbnail(thumbnail, imgPath, manga);

    const changeResult = this.changes.getChangeResult();
    if (changeResult.isFailure) {
      return left(Result.fail(changeResult.error));
    }

    await this.mangasRepository.create(manga);

    return right(Result.ok<void>());
  }
}

export namespace CreateManga {
  export type Request = {
    title: string;
    synopsis?: string;
    author?: string;
    artist?: string;
    format: IMangaType;
    demography?: IMangaDemography;
    thumbnail?: string;
    cover?: string;
    genres?: string[];
    alternativeTitles?: string[];
  };

  export type Response = Either<
    Result<any> | MangaAlreadyExitsError,
    Result<void>
  >;
}
