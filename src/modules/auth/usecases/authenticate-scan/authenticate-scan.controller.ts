import { Injectable } from '@nestjs/common';

import {
  clientError,
  Controller,
  fail,
  HttpResponse,
  notFound,
  ok,
} from '@core/infra';

import { AuthenticateScan } from './authenticate-scan.service';
import { ScanNotFoundError } from './errors';

@Injectable()
export class AuthenticateScanController implements Controller {
  constructor(private authenticateScan: AuthenticateScan) {}

  async handle({
    id,
    email,
    name,
  }: AuthenticateScanController.Request): Promise<HttpResponse> {
    try {
      const result = await this.authenticateScan.execute({
        scanID: id,
        name,
        email,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ScanNotFoundError:
            return notFound(error.errorValue());
          default:
            return clientError(error.errorValue());
        }
      } else {
        const accessToken = result.value;

        return ok({
          accessToken,
        });
      }
    } catch (err) {
      return fail(err);
    }
  }
}

export namespace AuthenticateScanController {
  export type Request = {
    id: string;
    name: string;
    email: string;
  };
}
