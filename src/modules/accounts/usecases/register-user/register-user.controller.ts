import { Injectable } from '@nestjs/common';

import {
  clientError,
  conflict,
  Controller,
  created,
  fail,
  HttpResponse,
} from '@core/infra';

import { CreateUserDTO } from '@modules/accounts/dtos';
import { UserAlreadyExistsError } from './errors';
import { RegisterUser } from './register-user.service';

@Injectable()
export class RegisterUserController implements Controller {
  constructor(private registerUser: RegisterUser) {}

  async handle({
    email,
    password,
    username,
  }: CreateUserDTO): Promise<HttpResponse> {
    try {
      const result = await this.registerUser.execute({
        email,
        password,
        username,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UserAlreadyExistsError:
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
