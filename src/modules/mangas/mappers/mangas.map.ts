import { Manga as PersistenceManga } from '@infra/prisma';
import {
  Genre,
  Manga,
  MangaAlternativeTitles,
  MangaDemography,
  MangaGenres,
  MangaSlug,
  MangaStatus,
  MangaSynopsis,
  MangaTitle,
  MangaType,
} from '@modules/mangas/domain/manga';

type PersistenceRaw = PersistenceManga;

export class MangaMapper {
  static toDomain(raw: PersistenceRaw): Manga {
    const title = MangaTitle.create({ value: raw.title }).getValue();
    const slug = MangaSlug.createFromExisting(raw.slug).getValue();
    const demography = MangaDemography.create(raw.demography).getValue();
    const status = MangaStatus.create(raw.status).getValue();
    const format = MangaType.create(raw.format).getValue();
    const synopsis = MangaSynopsis.create({ value: raw.synopsis }).getValue();

    const alternativeTitles = MangaAlternativeTitles.create(
      raw.alternative_titles.map((title) =>
        MangaTitle.create({ value: title }).getValue(),
      ),
    );

    const genres = MangaGenres.create(
      raw.genres.map((genre) => Genre.create({ name: genre }).getValue()),
    );

    const entityOrError = Manga.create(
      {
        format,
        status,
        title,
        slug,
        demography,
        synopsis,
        genres,
        alternativeTitles,
        artist: raw.artist,
        author: raw.author,
        cover: raw.cover,
        poster: raw.poster,
        lastPublishedAt: raw.last_published_at,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
      },
      raw.id,
    );

    if (entityOrError.isFailure) {
      console.log(entityOrError.error);
      return null;
    }

    return entityOrError.getValue();
  }

  static toPersistence(entity: Manga) {
    return {
      id: entity.id,
      title: entity.title.value,
      slug: entity.slug.value,
      synopsis: entity.synopsis.value,
      author: entity.author,
      artist: entity.artist,
      status: entity.status.value,
      format: entity.format.value,
      demography: entity.demography.value,
      poster: entity.poster,
      genres: entity.genres.getItems().map((genre) => genre.name),
      alternative_titles: entity.alternativeTitles
        .getItems()
        .map((title) => title.value),
      cover: entity.cover,
      last_published_at: entity.lastPublishedAt,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
