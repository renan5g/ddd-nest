import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@infra/prisma';

import { Chapter } from '@modules/mangas/domain/chapter';
import { ChapterWithDetails } from '@modules/mangas/dtos';
import {
  ChapterMapper,
  ChapterWithDetailsMapper,
} from '@modules/mangas/mappers';
import { IChaptersRepository } from '@modules/mangas/repositories/models';
import { PrismaChaptersPagesRepository } from './prisma-pages.repository';

@Injectable()
export class PrismaChaptersRepository implements IChaptersRepository {
  private readonly logger = new Logger(PrismaChaptersRepository.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly pagesRepository: PrismaChaptersPagesRepository,
  ) {}

  async exists(chapterNumber: string): Promise<boolean> {
    const chapter = await this.prismaService.chapter.findUnique({
      where: { chapter_number: chapterNumber },
    });

    return !!chapter;
  }

  async findById(id: string): Promise<Chapter> {
    const chapter = await this.prismaService.chapter.findUnique({
      where: { id },
    });

    if (!chapter) return null;

    return ChapterMapper.toDomain(chapter);
  }

  async findByIdWithDetails(id: string): Promise<ChapterWithDetails> {
    const chapter = await this.prismaService.chapter.findUnique({
      where: { id },
      include: {
        pages: true,
        scan: true,
      },
    });

    if (!chapter) return null;

    return ChapterWithDetailsMapper.toDto(chapter);
  }

  async findManyByManga(slug: string): Promise<ChapterWithDetails[]> {
    const chapters = await this.prismaService.chapter.findMany({
      where: { manga: { slug } },
      include: {
        pages: {
          orderBy: {
            page_number: 'asc',
          },
        },
        scan: true,
      },
      orderBy: {
        chapter_number: 'asc',
      },
    });

    return chapters.map((chapter) => ChapterWithDetailsMapper.toDto(chapter));
  }

  async save(chapter: Chapter) {
    const data = ChapterMapper.toPersistence(chapter);

    await this.prismaService.chapter.update({
      where: { id: chapter.id },
      data,
    });

    this.logger.log(JSON.stringify(data, undefined, 2));

    await this.pagesRepository.saveMany(chapter.pages, chapter.id);
  }

  async create(chapter: Chapter): Promise<void> {
    const data = ChapterMapper.toPersistence(chapter);

    await this.prismaService.chapter.create({
      data: {
        ...data,
        scan: {
          connect: {
            id: chapter.scanId,
          },
        },
        manga: {
          connect: {
            id: chapter.mangaId,
          },
        },
      },
    });

    this.logger.log(JSON.stringify(data, undefined, 2));

    await this.pagesRepository.createMany(chapter.pages, chapter.id);
  }
}
