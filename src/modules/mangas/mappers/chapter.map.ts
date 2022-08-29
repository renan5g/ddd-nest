import { Chapter } from '@modules/mangas/domain/chapter';
import { Chapter as PersistenceChapter } from '@prisma/client';
import { Link } from '@shared/domain/value-objects';

type PersistenceRaw = PersistenceChapter;

export class ChapterMapper {
  static toDomain(raw: PersistenceRaw): Chapter {
    const link = Link.create({ url: raw.link }).getValue();

    const entityOrError = Chapter.create(
      {
        link,
        title: raw.title,
        cover: raw.cover,
        chapterNumber: raw.chapter_number,
        mangaId: raw.manga_id,
        dateTimePosted: raw.date_time_posted,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        pagesCount: raw.pages_count,
      },
      raw.id,
    );

    if (entityOrError.isFailure) {
      console.log(entityOrError.error);
      return null;
    }

    return entityOrError.getValue();
  }

  static toPersistence(entity: Chapter) {
    return {
      id: entity.id,
      pages_count: entity.pagesCount,
      chapter_number: entity.chapterNumber,
      cover: entity.cover,
      title: entity.title,
      link: entity.link.url,
      date_time_posted: entity.dateTimePosted,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
