import { Injectable } from '@nestjs/common';

import {
  clientError,
  conflict,
  Controller,
  created,
  fail,
  HttpResponse,
} from '@core/infra';

import { CreateMangaDto, CreateMangaFilesDto } from './create-manga.dto';
import { CreateManga } from './create-manga.service';
import { MangaAlreadyExitsError } from './errors';

@Injectable()
export class CreateMangaController implements Controller {
  constructor(private createManga: CreateManga) {}

  async handle({
    cover,
    thumbnail,
    ...params
  }: CreateMangaController.Request): Promise<HttpResponse> {
    try {
      const result = await this.createManga.execute({
        cover: cover && cover[0]?.filename,
        thumbnail: cover && thumbnail[0]?.filename,
        ...params,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case MangaAlreadyExitsError:
            return conflict(error.errorValue());
          default:
            return clientError(error.errorValue());
        }
      } else {
        return created();
      }
    } catch (err) {
      return fail(err);
    }
  }
}

export namespace CreateMangaController {
  export type Request = CreateMangaDto & CreateMangaFilesDto;
}
