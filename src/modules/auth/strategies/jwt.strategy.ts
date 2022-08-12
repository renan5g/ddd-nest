import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from '@shared/constants';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JWTStrategy.Payload): Promise<any> {
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}

export namespace JWTStrategy {
  export type Payload = {
    sub: string;
    username: string;
    email: string;
  };
}
