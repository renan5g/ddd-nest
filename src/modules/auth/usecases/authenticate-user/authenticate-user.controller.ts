import { Injectable } from '@nestjs/common';

import {
  clientError,
  Controller,
  fail,
  HttpResponse,
  notFound,
  ok,
} from '@core/infra';

import { AuthenticateUser } from './authenticate-user.service';
import { UserNotFoundError } from './errors';

@Injectable()
export class AuthenticateUserController implements Controller {
  constructor(private authenticateUser: AuthenticateUser) {}

  async handle({
    email,
    id,
    username,
  }: AuthenticateUserController.Request): Promise<HttpResponse> {
    try {
      const result = await this.authenticateUser.execute({
        userID: id,
        email,
        username,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UserNotFoundError:
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

export namespace AuthenticateUserController {
  export type Request = {
    id: string;
    username: string;
    email: string;
  };
}
