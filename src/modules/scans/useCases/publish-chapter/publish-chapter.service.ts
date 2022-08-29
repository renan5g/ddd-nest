import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { UseCase } from '@core/domain';
import { Changes, Either, left, Result, right } from '@core/logic';
import { IStorageProvider } from '@infra/providers/storage/models';
import { TOKENS } from '@shared/constants';
import { Link } from '@shared/domain/value-objects';

import { Chapter, ChapterPage } from '@modules/mangas/domain/chapter';
import {
  IChaptersRepository,
  IMangasRepository,
} from '@modules/mangas/repositories/models';
import { IScansMangasRepository } from '@modules/scans/repositories/models';
import { extractArchive } from '@shared/utils';
import {
  ChapterAlreadyExistsError,
  NotFoundMangaError,
  ScanCanNotPermissionError,
} from './errors';

@Injectable()
export class PublishChapter
  implements UseCase<PublishChapter.Input, PublishChapter.Output>
{
  private changes: Changes;

  constructor(
    @Inject(TOKENS.STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,
    @Inject(TOKENS.MANGAS_REPOSITORY)
    private readonly mangasRepository: IMangasRepository,
    @Inject(TOKENS.SCANS_MANGAS_REPOSITORY)
    private readonly scansMangasRepository: IScansMangasRepository,
    @Inject(TOKENS.CHAPTERS_REPOSITORY)
    private readonly chaptersRepository: IChaptersRepository,
  ) {
    this.changes = new Changes();
  }

  async #registerPages(pagesFile: string, chapter: Chapter, slug: string) {
    const pages = await extractArchive(
      pagesFile,
      `mangas/${slug}/${chapter.chapterNumber}/pages`,
    );

    for (const [idx, page] of pages.sort().entries()) {
      const chaptersOrError = ChapterPage.create({
        pageNumber: idx + 1,
        chapterId: chapter.id,
        pageUrl: page,
      });
      if (chaptersOrError.isFailure) {
        throw new BadRequestException(chaptersOrError.errorValue());
      }

      const chapterPage = chaptersOrError.getValue();
      this.changes.addChange(chapter.addPage(chapterPage));
    }
  }

  async #setCover(cover: string, folder: string, chapter: Chapter) {
    const coverPath = await this.storageProvider.save(cover, folder);
    this.changes.addChange(chapter.changeCover(coverPath));
  }

  async execute({
    cover,
    mangaId,
    scanId,
    chapterNumber,
    dateTimePosted,
    pages,
    title,
  }: PublishChapter.Input): Promise<PublishChapter.Output> {
    const manga = await this.mangasRepository.findById(mangaId);
    if (!manga) {
      return left(new NotFoundMangaError());
    }

    const scan = await this.scansMangasRepository.findByScanAndManga({
      mangaId,
      scanId,
    });
    if (!scan) {
      return left(new ScanCanNotPermissionError());
    }

    const chapterAlreadyExists = await this.chaptersRepository.exists(
      chapterNumber,
    );
    if (chapterAlreadyExists) {
      return left(new ChapterAlreadyExistsError());
    }

    const linkOrError = Link.create({
      url: `${manga.slug.value}/${chapterNumber}`,
    });
    if (linkOrError.isFailure) {
      return left(Result.fail(linkOrError.errorValue()));
    }

    const chapterOrError = Chapter.create({
      cover,
      chapterNumber,
      title,
      mangaId,
      scanId,
      link: linkOrError.getValue(),
      dateTimePosted,
    });
    if (chapterOrError.isFailure) {
      return left(Result.fail(chapterOrError.errorValue()));
    }

    const chapter = chapterOrError.getValue();

    if (cover) {
      await this.#setCover(
        cover,
        `mangas/${manga.slug.value}/${chapter.chapterNumber}/cover`,
        chapter,
      );
    }

    if (pages && pages.length > 0) {
      await this.#registerPages(pages, chapter, manga.slug.value);
    }

    const result = this.changes.getChangeResult();
    if (result.isFailure) {
      return left(Result.fail(result.error));
    }

    await this.chaptersRepository.create(chapter);

    return right(Result.ok<void>());
  }
}

export namespace PublishChapter {
  export type Input = {
    title: string;
    mangaId: string;
    scanId: string;
    chapterNumber: string;
    dateTimePosted: Date;
    cover: string;
    pages: string;
  };

  export type Output = Either<
    | Result<any>
    | NotFoundMangaError
    | ScanCanNotPermissionError
    | ChapterAlreadyExistsError,
    Result<void>
  >;
}
