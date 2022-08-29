import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@infra/prisma';

import { ChapterPage, ChapterPages } from '@modules/mangas/domain/chapter';
import { ChapterPageMapper } from '@modules/mangas/mappers';
import { IChaptersPagesRepository } from '@modules/mangas/repositories/models';

@Injectable()
export class PrismaChaptersPagesRepository implements IChaptersPagesRepository {
  private readonly logger = new Logger(PrismaChaptersPagesRepository.name);

  constructor(private prismaService: PrismaService) {}

  async findManyByChapter(chapterId: string): Promise<ChapterPage[]> {
    const pages = await this.prismaService.chapterPage.findMany({
      where: { chapter_id: chapterId },
    });

    return pages.map((page) => ChapterPageMapper.toDomain(page));
  }

  async saveMany(pages: ChapterPages, chapterId: string): Promise<void> {
    if (pages.getNewItems().length > 0) {
      const data = pages
        .getNewItems()
        .map((page) => ChapterPageMapper.toPersistence(page));

      this.logger.log(JSON.stringify(data, undefined, 2));

      await this.prismaService.chapter.update({
        where: { id: chapterId },
        data: {
          pages: {
            createMany: {
              data,
              skipDuplicates: true,
            },
          },
        },
      });
    }

    if (pages.getRemovedItems().length > 0) {
      const removedIds = pages.getRemovedItems().map((page) => page.id);

      this.logger.log(removedIds);

      await this.prismaService.chapterPage.deleteMany({
        where: {
          id: {
            in: removedIds,
          },
        },
      });
    }
  }

  async createMany(pages: ChapterPages, chapterId: string): Promise<void> {
    const data = pages
      .getItems()
      .map((page) => ChapterPageMapper.toPersistence(page));

    this.logger.log(JSON.stringify(data, undefined, 2));

    await this.prismaService.chapter.update({
      where: { id: chapterId },
      data: {
        pages: {
          createMany: {
            data,
            skipDuplicates: true,
          },
        },
      },
    });
  }
}
