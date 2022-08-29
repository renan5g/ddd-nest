import { Chapter, Manga } from '@prisma/client';
import { MangaWithDetails } from '../dtos';

type PersistenceRaw = Manga & {
  chapters: Chapter[];
};

export class MangaWithDetailsMapper {
  static toDto(raw: PersistenceRaw): MangaWithDetails {
    return {
      id: raw.id,
      artist: raw.artist,
      author: raw.author,
      format: raw.format,
      slug: raw.slug,
      status: raw.status,
      synopsis: raw.synopsis,
      title: raw.title,
      alternativeTitles: raw.alternative_titles,
      chaptersCount: raw?.chapters.length,
      genres: raw.genres,
      cover: raw.cover,
      demography: raw.demography,
      // lastPublishedAt: new Date(),
      poster: raw.poster,
      chapters: raw.chapters.map((chapter) => ({
        id: chapter.id,
        cover: chapter.cover,
        title: chapter.title,
        dateTimePosted: chapter.date_time_posted,
        number: chapter.chapter_number,
        slug: chapter.link,
      })),
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }
}
