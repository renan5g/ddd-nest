import { Either, left, Result, right } from '@core/logic';
import {
  IMangaStatus,
  IMangaType,
  Manga,
  MangaSlug,
  MangaStatus,
  MangaSynopsis,
  MangaTitle,
  MangaType,
} from '@modules/mangas/domain/manga';
import { InvalidGenreError, InvalidTitleError } from '../errors';
import { IMangaDemography, MangaDemography } from '../manga-demography';

type CreateMangaRequest = {
  title: string;
  synopsis?: string;
  author?: string;
  artist?: string;
  status?: IMangaStatus;
  format: IMangaType;
  demography?: IMangaDemography;
  poster?: string;
  cover?: string;
};

type CreateMangaResponse = Either<
  InvalidGenreError | InvalidTitleError | Result<any>,
  Manga
>;

export function createManga({
  title,
  format,
  artist,
  author,
  cover,
  demography,
  poster,
  synopsis,
}: CreateMangaRequest): CreateMangaResponse {
  const titleOrError = MangaTitle.create({ value: title });
  const formatOrError = MangaType.create(format);
  const statusOrError = MangaStatus.create('ACTIVE');
  const synopsisOrError = MangaSynopsis.create({ value: synopsis });
  const demographyOrError = MangaDemography.create(demography);

  const dtoResult = Result.combine([
    titleOrError,
    formatOrError,
    statusOrError,
    synopsisOrError,
    demographyOrError,
  ]);

  if (dtoResult.isFailure) {
    return left(Result.fail<Manga>(dtoResult.error));
  }

  const slugOrError = MangaSlug.create(titleOrError.getValue());

  if (slugOrError.isFailure) {
    return left(Result.fail<Manga>(slugOrError.error));
  }

  const mangaOrError = Manga.create({
    title: titleOrError.getValue(),
    format: formatOrError.getValue(),
    slug: slugOrError.getValue(),
    status: statusOrError.getValue(),
    synopsis: synopsisOrError.getValue(),
    demography: demographyOrError.getValue(),
    artist,
    author,
    cover,
    poster,
  });

  if (mangaOrError.isFailure) {
    return left(Result.fail<Manga>(mangaOrError.error));
  }

  const manga = mangaOrError.getValue();

  return right(manga);
}
