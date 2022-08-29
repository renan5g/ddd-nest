import { IMangaDemography, IMangaType } from '@modules/mangas/domain/manga';

export class CreateMangaDto {
  title: string;
  synopsis?: string;
  author?: string;
  artist?: string;
  format: IMangaType;
  demography?: IMangaDemography;
  genres?: Array<string>;
  alternativeTitles?: string[];
}

export type CreateMangaFilesDto = {
  cover?: Express.Multer.File[];
  thumbnail?: Express.Multer.File[];
};
