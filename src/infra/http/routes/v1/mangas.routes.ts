import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { storage } from '@config/upload';
import { Public } from '@infra/http/decorators';
import { UserAuthGuard } from '@infra/http/guards';
import { CreateMangaDto, CreateMangaFilesDto } from '@modules/mangas/dtos';
import {
  CreateMangaController,
  GetManga,
  ListAllChapters,
  SearchMangas,
} from '@modules/mangas/useCases';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchInputParams } from '@shared/dtos';
import { imageFileFilter } from '@shared/utils';
import { Response } from 'express';

@ApiTags('Mangas')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({
  path: 'mangas',
  version: '1',
})
export class MangasRoutes {
  constructor(
    private readonly _createMangaController: CreateMangaController,
    private readonly _listAllChaptersService: ListAllChapters,
    private readonly _getMangaService: GetManga,
    private readonly _searchMangasService: SearchMangas,
  ) {}

  @Public()
  @Get(':slug/details')
  async show(@Param('slug') slug: string) {
    const result = await this._getMangaService.execute({ slug });
    return result;
  }

  @Public()
  @Get(':slug/chapters')
  async chapters(@Param('slug') slug: string) {
    const result = await this._listAllChaptersService.execute({ slug });
    return result;
  }

  @Public()
  @Get('search')
  async search(@Query() { page, perPage, q }: SearchInputParams) {
    const result = await this._searchMangasService.execute({
      page: page ? parseInt(page, 10) : undefined,
      perPage: perPage ? parseInt(perPage, 10) : undefined,
      query: q,
    });
    return result;
  }

  @Post('new')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'cover',
          maxCount: 1,
        },
        {
          name: 'thumbnail',
          maxCount: 1,
        },
      ],
      {
        storage,
        fileFilter: imageFileFilter,
      },
    ),
  )
  async create(
    @Req() req: any,
    @Body() input: { data: string },
    @UploadedFiles() files: CreateMangaFilesDto,
    @Res() res: Response,
  ) {
    const data = JSON.parse(input.data) as CreateMangaDto;
    const httpResponse = await this._createMangaController.handle({
      ...data,
      ...files,
    });
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
