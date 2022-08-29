import { Manga } from '@modules/mangas/domain/manga';
import { MangaWithDetails } from '@modules/mangas/dtos';
import { SearchParams, SearchResult } from '@shared/dtos';

export interface IMangasRepository {
  exists(title: string): Promise<boolean>;
  findById(id: string): Promise<Manga>;
  findBySlug(title: string): Promise<Manga>;
  findManyByIds(mangaIds: string[]): Promise<Manga[]>;
  findBySlugWithDetails(title: string): Promise<MangaWithDetails>;
  create(manga: Manga): Promise<void>;
  save(manga: Manga): Promise<void>;
  delete(id: string): Promise<void>;
  search(params: SearchParams): Promise<SearchResult<MangaWithDetails>>;
}
