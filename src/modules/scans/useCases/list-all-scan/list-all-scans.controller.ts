import { Injectable } from '@nestjs/common';

import { Controller, fail, HttpResponse, ok } from '@core/infra';
import { SearchInputParams } from '@shared/dtos';
import { ListAllScans } from './list-all-scans.service';

@Injectable()
export class ListAllScansController implements Controller {
  constructor(private listAllScans: ListAllScans) {}

  async handle({ page, perPage, q }: SearchInputParams): Promise<HttpResponse> {
    try {
      const { data, totalCount } = await this.listAllScans.execute({
        page: page ? parseInt(page, 10) : undefined,
        perPage: perPage ? parseInt(perPage, 10) : undefined,
        query: q,
      });

      return ok({ data, totalCount });
    } catch (err) {
      return fail(err);
    }
  }
}
