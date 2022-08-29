import { Chapter, ChapterPage, Scan } from '@infra/prisma';
import { ChapterWithDetails } from '../dtos';

type PersistenceRaw = Chapter & {
  pages: ChapterPage[];
  scan: Scan;
};

export class ChapterWithDetailsMapper {
  static toDto(raw: PersistenceRaw): ChapterWithDetails {
    return {
      id: raw.id,
      cover: raw.cover,
      title: raw.title,
      slug: raw.link,
      number: raw.chapter_number,
      dateTimePosted: raw.date_time_posted,
      pagesCount: raw.pages_count,
      pages: raw.pages.map((page) => ({
        id: page.id,
        pageNumber: page.page_number,
        pageUrl: page.page_url,
      })),
      scan: {
        id: raw.scan.id,
        cover: raw.scan.cover,
        label: raw.scan.name,
        value: raw.scan.slug,
        link: raw.scan.link,
      },
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };
  }
}
