import { ChapterPage as PersistenceChapterPage } from '@infra/prisma';
import { ChapterPage } from '@modules/mangas/domain/chapter';

type PersistenceRaw = PersistenceChapterPage;

export class ChapterPageMapper {
  static toDomain(raw: PersistenceRaw): ChapterPage {
    const entityOrError = ChapterPage.create(
      {
        chapterId: raw.chapter_id,
        pageNumber: raw.page_number,
        pageUrl: raw.page_url,
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

  static toPersistence(entity: ChapterPage) {
    return {
      id: entity.id,
      page_url: entity.pageUrl,
      page_number: entity.pageNumber,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
