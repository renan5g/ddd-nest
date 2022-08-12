import { Either, left, Result, right } from '@core/logic';
import { User } from '@modules/accounts/domain/user';
import { IUsersRepository } from '@modules/accounts/repositories/models';
import { Password } from '@shared/domain/value-objects';
import { ErrorMessages } from '@shared/errors';

export class ValidateUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    password,
    login,
  }: ValidateUser.Input): Promise<ValidateUser.Output> {
    const user = await this.usersRepository.findByEmailOrUsername({
      email: login,
      username: login,
    });

    if (!user) {
      return left(
        Result.fail<User>(new Error(ErrorMessages.USER_DOES_NOT_EXIST)),
      );
    }

    const isValidPassword = await user.password.comparePassword(password);

    if (!isValidPassword) {
      return left(
        Result.fail<Password>(new Error(ErrorMessages.INVALID_CREDENTIAL)),
      );
    }

    return right(user);
  }
}

export namespace ValidateUser {
  export type Input = {
    login: string;
    password: string;
  };

  export type Output = Either<Result<any>, User>;
}
