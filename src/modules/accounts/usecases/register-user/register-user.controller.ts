import {
  clientError,
  Controller,
  fail,
  HttpResponse,
  notFound,
  ok,
} from '@core/infra';
import { UserNotFoundError } from './errors';
import { RegisterUser } from './register-user.service';

export class RegisterUserController implements Controller {
  constructor(private registerUser: RegisterUser) {}

  async handle({
    email,
    password,
    username,
  }: RegisterUserController.Request): Promise<HttpResponse> {
    try {
      const result = await this.registerUser.execute({
        email,
        password,
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
        return ok();
      }
    } catch (err) {
      return fail(err);
    }
  }
}

export namespace RegisterUserController {
  export type Request = {
    email: string;
    username: string;
    password: string;
  };
}
