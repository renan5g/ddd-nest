import { ChapterPage, ChapterPages } from '@modules/mangas/domain/chapter';

export interface IChaptersPagesRepository {
  findManyByChapter(id: string): Promise<ChapterPage[]>;
  saveMany(pages: ChapterPages, chapterId: string): Promise<void>;
  createMany(pages: ChapterPages, chapterId: string): Promise<void>;
}
