import { IMangaStatus, IMangaType } from '@modules/mangas/domain/manga';

export type ScanMangasDetails = {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  author: string;
  artist: string;
  format: IMangaType;
  status: IMangaStatus;
  demography?: string;
  genres: string[];
  alternativeTitles?: Array<string>;
  poster?: string;
  cover?: string;
  chaptersCount?: number;
  lastPublishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
