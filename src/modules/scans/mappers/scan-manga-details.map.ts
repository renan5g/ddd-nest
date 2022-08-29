import { Manga, ScanManga } from '@infra/prisma';
import { ScanMangasDetails } from '../dtos';

type PersistenceRaw = ScanManga & {
  manga: Manga;
};

export class ScanMangaDetailsMapper {
  static toDto(raw: PersistenceRaw): ScanMangasDetails {
    return {
      id: raw.manga.id,
      artist: raw.manga.artist,
      author: raw.manga.author,
      format: raw.manga.format,
      slug: raw.manga.slug,
      status: raw.manga.status,
      synopsis: raw.manga.synopsis,
      title: raw.manga.title,
      alternativeTitles: raw.manga.alternative_titles,
      chaptersCount: raw.manga.chapters_count,
      genres: raw.manga.genres,
      cover: raw.manga.cover,
      demography: raw.manga.demography,
      lastPublishedAt: raw.manga.last_published_at,
      poster: raw.manga.poster,
      createdAt: raw.manga.created_at,
      updatedAt: raw.manga.updated_at,
    };
  }
}
