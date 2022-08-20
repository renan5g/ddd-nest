import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
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
