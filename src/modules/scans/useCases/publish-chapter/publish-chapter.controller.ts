import { Injectable } from '@nestjs/common';

import {
  clientError,
  conflict,
  Controller,
  created,
  fail,
  HttpResponse,
  notFound,
  unauthorized,
} from '@core/infra';

import {
  ChapterAlreadyExistsError,
  NotFoundMangaError,
  ScanCanNotPermissionError,
} from './errors';
import { PublishChapter } from './publish-chapter.service';

@Injectable()
export class PublishChapterController implements Controller {
  constructor(private publishChapter: PublishChapter) {}

  async handle({
    cover,
    pages,
    ...params
  }: PublishChapterController.Request): Promise<HttpResponse> {
    try {
      const data = {
        cover: cover && cover[0]?.filename,
        pages: pages && pages[0]?.filename,
        ...params,
      };

      const result = await this.publishChapter.execute(data);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ChapterAlreadyExistsError:
            return conflict(error.errorValue());
          case NotFoundMangaError:
            return notFound(error.errorValue());
          case ScanCanNotPermissionError:
            return unauthorized(error.errorValue());
          default:
            return clientError(error.errorValue());
        }
      } else {
        return created();
      }
    } catch (err) {
      return fail(err);
    }
  }
}

export namespace PublishChapterController {
  export type Request = {
    mangaId: string;
    scanId: string;
    title: string;
    chapterNumber: string;
    dateTimePosted: Date;
    cover?: Express.Multer.File[];
    pages?: Express.Multer.File[];
  };
}
