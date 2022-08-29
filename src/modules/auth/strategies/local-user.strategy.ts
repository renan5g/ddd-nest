import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUser } from '../services';

@Injectable()
export class UserLocalStrategy extends PassportStrategy(
  Strategy,
  'local.user',
) {
  constructor(private validateUser: ValidateUser) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string): Promise<any> {
    const result = await this.validateUser.execute({ login, password });

    if (result.isLeft()) {
      const error = result.value;

      throw new UnauthorizedException(error.errorValue());
    }

    const data = result.value;

    const user = {
      id: data.id,
      name: data.username.value,
      email: data.email.value,
    };

    return user;
  }
}
