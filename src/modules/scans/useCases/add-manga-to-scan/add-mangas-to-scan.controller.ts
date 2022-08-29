import { Injectable } from '@nestjs/common';

import {
  clientError,
  Controller,
  created,
  fail,
  HttpResponse,
  notFound,
} from '@core/infra';

import { AddMangasToScanDto } from './add-mangas-to-scan.dto';
import { AddMangasToScan } from './add-mangas-to-scan.service';
import { NotFoundMangaError, NotFoundScanError } from './errors';

@Injectable()
export class AddMangasToScanController implements Controller {
  constructor(private addMangasToScan: AddMangasToScan) {}

  async handle({ mangaIds, scan }: AddMangasToScanDto): Promise<HttpResponse> {
    try {
      const result = await this.addMangasToScan.execute({
        mangaIds,
        scanSlug: scan,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case NotFoundMangaError:
          case NotFoundScanError:
            return notFound(error.errorValue());
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
