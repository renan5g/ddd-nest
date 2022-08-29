import { Inject, Injectable } from '@nestjs/common';

import { Either, left, Result, right } from '@core/logic';
import { TOKENS } from '@shared/constants';
import { Password } from '@shared/domain/value-objects';
import { ErrorMessages } from '@shared/errors';

import { Scan } from '@modules/scans/domain/scan';
import { IScansRepository } from '@modules/scans/repositories/models';
import { ScanNotFoundError } from './errors/scan-not-found.error';

@Injectable()
export class ValidateScan {
  constructor(
    @Inject(TOKENS.SCANS_REPOSITORY)
    private scansRepository: IScansRepository,
  ) {}

  async execute({
    password,
    login,
  }: ValidateScan.Input): Promise<ValidateScan.Output> {
    const scan = await this.scansRepository.findByNameOrEmail({
      email: login,
      name: login,
    });

    if (!scan) {
      return left(new ScanNotFoundError());
    }

    const isValidPassword = await scan.password.comparePassword(password);

    if (!isValidPassword) {
      return left(
        Result.fail<Password>(new Error(ErrorMessages.INVALID_CREDENTIAL)),
      );
    }

    return right(scan);
  }
}

export namespace ValidateScan {
  export type Input = {
    login: string;
    password: string;
  };

  export type Output = Either<Result<any> | ScanNotFoundError, Scan>;
}
