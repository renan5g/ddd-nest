import { UseCase } from '@core/domain';
import { Either, left, Result, right } from '@core/logic';
import { Email, Name, Password } from '@shared/domain/value-objects';

import { User } from '@modules/accounts/domain/user';
import { IUsersRepository } from '@modules/accounts/repositories/models';
import { UserNotFoundError } from './errors';

export class RegisterUser
  implements UseCase<RegisterUser.Input, RegisterUser.Output>
{
  constructor(private readonly usersRepo: IUsersRepository) {}

  async execute({
    email,
    password,
    username,
  }: RegisterUser.Input): Promise<RegisterUser.Output> {
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create({ value: password });
    const usernameOrError = Name.create(username);

    const dtoResult = Result.combine([
      emailOrError,
      passwordOrError,
      usernameOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail(dtoResult.error));
    }

    const userAlreadyExists = await this.usersRepo.exists({
      email,
      username,
    });

    if (userAlreadyExists) {
      return left(new UserNotFoundError());
    }

    const userOrError = User.create({
      email: emailOrError.getValue(),
      username: usernameOrError.getValue(),
      password: passwordOrError.getValue(),
    });

    if (userOrError.isFailure) {
      return left(Result.fail(userOrError.error));
    }

    const user = userOrError.getValue();

    await this.usersRepo.save(user);

    return right(Result.ok<void>());
  }
}

export namespace RegisterUser {
  export type Input = {
    username: string;
    email: string;
    password: string;
  };

  export type Output = Either<Result<any> | UserNotFoundError, Result<void>>;
}
