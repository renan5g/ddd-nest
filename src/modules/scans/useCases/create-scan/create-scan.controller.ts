import { Injectable } from '@nestjs/common';

import {
  clientError,
  conflict,
  Controller,
  created,
  fail,
  HttpResponse,
} from '@core/infra';
import { CreateScanCoverFileDto, CreateScanDto } from './create-scan.dto';
import { CreateScan } from './create-scan.service';
import { ScanAlreadyExistsError } from './errors';

@Injectable()
export class CreateScanController implements Controller {
  constructor(private createScan: CreateScan) {}

  async handle({
    cover,
    ...params
  }: CreateScanController.Request): Promise<HttpResponse> {
    try {
      const result = await this.createScan.execute({
        cover: cover.filename,
        ...params,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ScanAlreadyExistsError:
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

export namespace CreateScanController {
  export type Request = CreateScanDto & CreateScanCoverFileDto;
}
