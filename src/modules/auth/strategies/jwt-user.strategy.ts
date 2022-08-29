import { ExtractJwt, Strategy } from 'passport-jwt';

import { IUsersRepository } from '@modules/accounts/repositories/models';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants, TOKENS } from '@shared/constants';

@Injectable()
export class UserJWTStrategy extends PassportStrategy(Strategy, 'jwt.user') {
  constructor(
    @Inject(TOKENS.USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: UserJWTStrategy.Payload): Promise<any> {
    const user = await this.usersRepository.findById(payload.sub);

    if (!user) throw new UnauthorizedException();

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}

export namespace UserJWTStrategy {
  export type Payload = {
    sub: string;
    name: string;
    email: string;
  };
}
