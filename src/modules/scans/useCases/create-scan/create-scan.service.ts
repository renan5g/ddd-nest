import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { Changes, Either, left, Result, right } from '@core/logic';
import { IStorageProvider } from '@infra/providers/storage/models';
import { TOKENS } from '@shared/constants';
import { Email, Name, Password } from '@shared/domain/value-objects';

import { Scan, ScanSlug } from '@modules/scans/domain/scan';
import { IScansRepository } from '@modules/scans/repositories/models';
import { rollbackFilesUpload } from '@shared/utils';
import { ScanAlreadyExistsError } from './errors';

@Injectable()
export class CreateScan
  implements UseCase<CreateScan.Input, CreateScan.Output>
{
  private changes: Changes;

  constructor(
    @Inject(TOKENS.SCANS_REPOSITORY)
    private readonly scansRepository: IScansRepository,
    @Inject(TOKENS.STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,
  ) {
    this.changes = new Changes();
  }

  async #setCover(cover: string, folder: string, scan: Scan) {
    const filepath = await this.storageProvider.save(cover, folder, false);
    this.changes.addChange(scan.changeCoverImg(filepath));
  }

  async execute({
    email,
    name,
    password,
    cover,
    description,
    discord,
    facebook,
    website,
  }: CreateScan.Input): Promise<CreateScan.Output> {
    const scanAlreadyExists = await this.scansRepository.exists({
      email,
      name,
    });

    if (scanAlreadyExists) {
      await rollbackFilesUpload(cover);
      return left(new ScanAlreadyExistsError());
    }

    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const slugOrError = ScanSlug.create(name);
    const passwordOrError = Password.create({ value: password });

    const dtoResult = Result.combine([
      nameOrError,
      emailOrError,
      passwordOrError,
      slugOrError,
    ]);

    if (dtoResult.isFailure) {
      await rollbackFilesUpload(cover);
      return left(Result.fail(dtoResult.error));
    }

    const scanOrError = Scan.create({
      email: emailOrError.getValue(),
      name: nameOrError.getValue(),
      password: passwordOrError.getValue(),
      slug: slugOrError.getValue(),
      description,
      discord,
      facebook,
      website,
    });

    if (scanOrError.isFailure) {
      await rollbackFilesUpload(cover);
      return left(Result.fail<Scan>(scanOrError.error));
    }

    const scan = scanOrError.getValue();

    const scanPath = `/scans/${scan.slug.value}`;
    if (cover) await this.#setCover(cover, scanPath, scan);

    await this.scansRepository.create(scan);
    return right(Result.ok<void>());
  }
}

export namespace CreateScan {
  export type Input = {
    name: string;
    email: string;
    password: string;
    cover?: string;
    description?: string;
    website?: string;
    discord?: string;
    facebook?: string;
  };

  export type Output = Either<
    Result<any> | ScanAlreadyExistsError,
    Result<void>
  >;
}
