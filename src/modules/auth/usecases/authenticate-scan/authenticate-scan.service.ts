import { Either, left, Result, right } from '@core/logic';
import { IScansRepository } from '@modules/scans/repositories/models';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TOKENS } from '@shared/constants';
import { ScanNotFoundError } from './errors';

@Injectable()
export class AuthenticateScan {
  constructor(
    @Inject(TOKENS.SCANS_REPOSITORY)
    private scansRepository: IScansRepository,
    private jwtService: JwtService,
  ) {}

  async execute({
    scanID,
    name,
    email,
  }: AuthenticateScan.Input): Promise<AuthenticateScan.Output> {
    const scan = await this.scansRepository.findByNameOrEmail({
      email,
      name,
    });

    if (!scan) {
      return left(new ScanNotFoundError());
    }

    const payload = {
      sub: scanID,
      name: scan.name.value,
      email: scan.email.value,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    await this.scansRepository.save(scan);

    return right(accessToken);
  }
}

export namespace AuthenticateScan {
  export type Input = {
    scanID: string;
    name: string;
    email: string;
  };

  type JWTToken = string;

  export type Output = Either<Result<any> | ScanNotFoundError, JWTToken>;
}
