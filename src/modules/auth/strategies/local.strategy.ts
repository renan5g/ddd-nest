import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUser } from '../services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private validateUser: ValidateUser) {
    super();
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
      username: data.username.value,
      email: data.email.value,
      accessToken: data.accessToken,
      lastLogin: data.lastLogin,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return user;
  }
}
