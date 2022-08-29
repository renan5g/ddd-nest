import { IsOptional, IsString, IsUUID } from 'class-validator';

export class PublishChapterDto {
  @IsUUID()
  mangaId: string;

  @IsOptional()
  @IsString()
  title: string;

  chapterNumber: string;
  dateTimePosted: Date;
}

export type PublishChapterFilesDto = {
  cover?: Express.Multer.File[];
  pages?: Express.Multer.File[];
};
