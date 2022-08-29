import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddMangasToScanDto {
  @ApiProperty()
  scan: string;

  @ApiProperty()
  @IsArray()
  mangaIds: string[];
}
