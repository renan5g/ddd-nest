import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUser } from '../services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private validateUser: ValidateUser) {
    super();
  }

  async validate(login: string, password: string): Promise<any> {
    try {
      const result = await this.validateUser.execute({ login, password });

      if (result.isLeft()) {
        const error = result.value;

        return new BadRequestException(error.errorValue());
      } else {
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
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
