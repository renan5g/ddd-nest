import { Chapter } from '@modules/mangas/domain/chapter';
import { ChapterWithDetails } from '@modules/mangas/dtos';

export interface IChaptersRepository {
  exists(chapterNumber: string): Promise<boolean>;
  findById(id: string): Promise<Chapter>;
  findByIdWithDetails(id: string): Promise<ChapterWithDetails>;
  findManyByManga(slug: string): Promise<ChapterWithDetails[]>;
  save(chapter: Chapter): Promise<void>;
  create(chapter: Chapter): Promise<void>;
}
