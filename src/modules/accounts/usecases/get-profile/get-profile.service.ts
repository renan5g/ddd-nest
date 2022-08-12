import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { Either, left, Result, right } from '@core/logic';
import { TOKENS } from '@shared/constants';

import { User } from '@modules/accounts/domain/user';
import { IUsersRepository } from '@modules/accounts/repositories/models';

@Injectable()
export class GetProfile
  implements UseCase<GetProfile.Input, GetProfile.Output>
{
  constructor(
    @Inject(TOKENS.USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,
  ) {}

  async execute({
    email,
    username,
  }: GetProfile.Input): Promise<GetProfile.Output> {
    const user = await this.usersRepo.findByEmailOrUsername({
      email,
      username,
    });

    if (!user) {
      return left(Result.fail(new Error('user not found')));
    }

    return right(user);
  }
}

export namespace GetProfile {
  export type Input = {
    username?: string;
    email?: string;
  };

  export type Output = Either<Result<any>, User>;
}
