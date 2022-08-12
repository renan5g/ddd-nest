import { Injectable } from '@nestjs/common';

import { clientError, Controller, fail, HttpResponse, ok } from '@core/infra';

import { GetProfile } from './get-profile.service';

@Injectable()
export class GetProfileController implements Controller {
  constructor(private getProfile: GetProfile) {}

  async handle({
    email,
    username,
  }: GetProfileController.Request): Promise<HttpResponse> {
    try {
      const result = await this.getProfile.execute({
        email,
        username,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return clientError(error.errorValue());
        }
      } else {
        const data = result.value;

        const user = {
          id: data.id,
          username: data.username.value,
          email: data.email.value,
          // accessToken: data.accessToken,
          lastLogin: data.lastLogin,
          isDeleted: data.isDeleted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        return ok(user);
      }
    } catch (err) {
      return fail(err);
    }
  }
}

export namespace GetProfileController {
  export type Request = {
    username?: string;
    email?: string;
  };
}
