import { Injectable } from '@nestjs/common';

import { Controller, fail, HttpResponse, ok } from '@core/infra';
import { SearchInputParams } from '@shared/dtos';
import { GetAllMangasByScan } from './get-scans-mangas.service';

@Injectable()
export class GetAllMangasByScanController implements Controller {
  constructor(private getAllMangasByScan: GetAllMangasByScan) {}

  async handle({
    page,
    scan,
    perPage,
    q,
  }: GetAllMangasByScanController.Request): Promise<HttpResponse> {
    try {
      const { data, totalCount } = await this.getAllMangasByScan.execute({
        page: page ? parseInt(page, 10) : undefined,
        perPage: perPage ? parseInt(perPage, 10) : undefined,
        query: q,
        scan,
      });

      return ok({ data, totalCount });
    } catch (err) {
      return fail(err);
    }
  }
}

export namespace GetAllMangasByScanController {
  export type Request = SearchInputParams & {
    scan: string;
  };
}
