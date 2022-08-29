import { IMangaDemography, IMangaType } from '@modules/mangas/domain/manga';

export class CreateMangaDto {
  title: string;
  synopsis?: string;
  author?: string;
  artist?: string;
  format: IMangaType;
  demography?: IMangaDemography;
  genres?: string[];
  alternativeTitles?: string[];
}

export type CreateMangaFilesDto = {
  thumbnail?: Express.Multer.File[];
  cover?: Express.Multer.File[];
};
