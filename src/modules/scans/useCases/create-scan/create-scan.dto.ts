import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScanDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  discord?: string;

  @ApiPropertyOptional()
  facebook?: string;
}

export class CreateScanCoverFileDto {
  cover?: Express.Multer.File;
}
