import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { storage } from '@config/upload';
import { CurrentUser, Public } from '@infra/http/decorators';
import { UserAuthGuard } from '@infra/http/guards';
import { SearchInputParams } from '@shared/dtos';
import { imageFileFilter } from '@shared/utils';

import {
  AddMangasToScanController,
  AddMangasToScanDto,
  CreateScanController,
  CreateScanDto,
  GetAllMangasByScanController,
  ListAllScansController,
} from '@modules/scans/useCases';

@ApiTags('Scans')
@UseGuards(UserAuthGuard)
@Controller({
  path: 'scans',
  version: '1',
})
export class ScansRoutes {
  constructor(
    private readonly _createScanController: CreateScanController,
    private readonly _addMangasToScanController: AddMangasToScanController,
    private readonly _listAllScansController: ListAllScansController,
    private readonly _getAllMangasByScanController: GetAllMangasByScanController,
  ) {}

  @Public()
  @Get('search')
  async list(
    @CurrentUser() user: any,
    @Query() params: SearchInputParams,
    @Res() res: Response,
  ) {
    console.log(user);
    const httpResponse = await this._listAllScansController.handle(params);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @Public()
  @Get(':slug/mangas')
  async listMangas(
    @Param('slug') scan: string,
    @Query() query: SearchInputParams,
    @Res() res: Response,
  ) {
    const httpResponse = await this._getAllMangasByScanController.handle({
      scan,
      ...query,
    });
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @Post('new')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage,
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateScanDto,
    @Res() res: Response,
  ) {
    const httpResponse = await this._createScanController.handle({
      ...data,
      cover: file,
    });
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @Patch(':slug/mangas/add')
  async addManga(
    @Param('slug') scan: string,
    @Body() data: Omit<AddMangasToScanDto, 'slug'>,
    @Res() res: Response,
  ) {
    console.log(data);
    const httpResponse = await this._addMangasToScanController.handle({
      scan,
      ...data,
    });
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
