import type { Response } from 'express';

import { storage } from '@config/upload';
import { CurrentUser } from '@infra/http/decorators';
import { ScanAuthGuard } from '@infra/http/guards/scan.guard';
import { AuthUserDTO } from '@modules/auth/dtos';
import {
  PublishChapterController,
  PublishChapterDto,
  PublishChapterFilesDto,
} from '@modules/scans/useCases';
import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { imageFileFilter } from '@shared/utils';

@ApiTags('Chapters')
@ApiBearerAuth()
@UseGuards(ScanAuthGuard)
@Controller({
  path: 'chapters',
  version: '1',
})
export class ChaptersRoutes {
  constructor(
    private readonly _publishChapterController: PublishChapterController,
  ) {}

  @Post('publish')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'cover',
          maxCount: 1,
        },
        {
          name: 'pages',
          maxCount: 1,
        },
      ],
      {
        storage,
        fileFilter: imageFileFilter,
      },
    ),
  )
  async publish(
    @CurrentUser() scan: AuthUserDTO,
    @Body() data: PublishChapterDto,
    @UploadedFiles() files: PublishChapterFilesDto,
    @Res() res: Response,
  ) {
    const httpResponse = await this._publishChapterController.handle({
      ...data,
      ...files,
      scanId: scan.id,
    });
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
