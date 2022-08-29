import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { Either, left, Result, right } from '@core/logic';
import { TOKENS } from '@shared/constants';

import { IMangasRepository } from '@modules/mangas/repositories/models';
import { Scan, ScanManga } from '@modules/scans/domain/scan';
import { IScansRepository } from '@modules/scans/repositories/models';
import { NotFoundMangaError, NotFoundScanError } from './errors';

@Injectable()
export class AddMangasToScan
  implements UseCase<AddMangasToScan.Input, AddMangasToScan.Output>
{
  constructor(
    @Inject(TOKENS.MANGAS_REPOSITORY)
    private readonly mangasRepository: IMangasRepository,
    @Inject(TOKENS.SCANS_REPOSITORY)
    private readonly scansRepository: IScansRepository,
  ) {}

  private registerMangas(mangasIds: string[], scan: Scan) {
    for (const mangaId of mangasIds) {
      const scanMangaOrError = ScanManga.create({
        mangaId,
        scanId: scan.id,
      });
      if (scanMangaOrError.isFailure) {
        throw new BadRequestException(scanMangaOrError.errorValue());
      }

      const scanManga = scanMangaOrError.getValue();

      scan.addManga(scanManga);

      return Result.ok();
    }
  }

  async execute({
    mangaIds,
    scanSlug,
  }: AddMangasToScan.Input): Promise<AddMangasToScan.Output> {
    const mangas = await this.mangasRepository.findManyByIds(mangaIds);
    if (mangas.length <= 0) {
      return left(new NotFoundMangaError());
    }

    const scan = await this.scansRepository.findBySlug(scanSlug);
    if (!scan) {
      return left(new NotFoundScanError());
    }

    const _mangasIds = mangas.map((manga) => manga.id);
    this.registerMangas(_mangasIds, scan);

    await this.scansRepository.save(scan);

    return right(Result.ok<void>());
  }
}

export namespace AddMangasToScan {
  export type Input = {
    scanSlug: string;
    mangaIds: string[];
  };

  export type Output = Either<
    Result<any> | NotFoundMangaError | NotFoundScanError,
    Result<void>
  >;
}
