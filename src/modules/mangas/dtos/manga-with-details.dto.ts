import { IMangaStatus, IMangaType } from '@modules/mangas/domain/manga';

export type MangaWithDetails = {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  author: string;
  artist: string;
  format: IMangaType;
  status: IMangaStatus;
  demography?: string;
  chapters: Chapter[];
  genres: string[];
  alternativeTitles?: Array<string>;
  poster?: string;
  cover?: string;
  chaptersCount?: number;
  lastPublishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type Chapter = {
  id: string;
  slug: string;
  cover: string;
  title: string;
  number: string;
  dateTimePosted: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
