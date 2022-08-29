import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateScan } from '../services';

@Injectable()
export class LocalScanStrategy extends PassportStrategy(
  Strategy,
  'local.scan',
) {
  constructor(private validateScan: ValidateScan) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string): Promise<any> {
    const result = await this.validateScan.execute({ login, password });

    if (result.isLeft()) {
      const error = result.value;

      throw new UnauthorizedException(error.errorValue());
    }

    const data = result.value;

    const scan = {
      id: data.id,
      name: data.slug.value,
      email: data.email.value,
    };

    return scan;
  }
}
