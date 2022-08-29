import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IScansRepository } from '@modules/scans/repositories/models';
import { jwtConstants, TOKENS } from '@shared/constants';

@Injectable()
export class ScanJWTStrategy extends PassportStrategy(Strategy, 'jwt.scan') {
  constructor(
    @Inject(TOKENS.SCANS_REPOSITORY)
    private readonly scanRepository: IScansRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: ScanJWTStrategy.Payload): Promise<any> {
    const scan = await this.scanRepository.findById(payload.sub);

    if (!scan) throw new UnauthorizedException();

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}

export namespace ScanJWTStrategy {
  export type Payload = {
    sub: string;
    name: string;
    email: string;
  };
}
