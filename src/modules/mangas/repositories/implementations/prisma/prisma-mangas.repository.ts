import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '@infra/prisma';
import { SearchParams, SearchResult } from '@shared/dtos';

import { Manga } from '@modules/mangas/domain/manga';
import { MangaWithDetails } from '@modules/mangas/dtos';
import { MangaMapper, MangaWithDetailsMapper } from '@modules/mangas/mappers';
import { IMangasRepository } from '@modules/mangas/repositories/models';

@Injectable()
export class PrismaMangasRepository implements IMangasRepository {
  private readonly logger = new Logger(PrismaMangasRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async exists(title: string): Promise<boolean> {
    const manga = await this.prismaService.manga.findUnique({
      where: { title: title },
    });

    return !!manga;
  }

  async findById(id: string): Promise<Manga> {
    const manga = await this.prismaService.manga.findUnique({
      where: { id },
    });

    if (!manga) return null;

    return MangaMapper.toDomain(manga);
  }

  async findBySlug(slug: string): Promise<Manga> {
    const manga = await this.prismaService.manga.findUnique({
      where: { slug },
    });

    if (!manga) return null;

    return MangaMapper.toDomain(manga);
  }

  async findManyByIds(mangasIds: string[]): Promise<Manga[]> {
    const mangas = await this.prismaService.manga.findMany({
      where: {
        id: {
          in: mangasIds,
        },
      },
    });

    return mangas.map((manga) => MangaMapper.toDomain(manga));
  }

  async findBySlugWithDetails(slug: string): Promise<MangaWithDetails> {
    const manga = await this.prismaService.manga.findFirst({
      where: {
        slug,
      },
      include: {
        chapters: {
          orderBy: {
            chapter_number: 'asc',
          },
        },
      },
    });

    if (!manga) return null;

    return MangaWithDetailsMapper.toDto(manga);
  }

  async search({
    page,
    perPage,
    query,
  }: SearchParams): Promise<SearchResult<MangaWithDetails>> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    };

    if (query) {
      queryPayload.where = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { alternative_titles: { has: query } },
        ],
      };
    }

    const mangas = await this.prismaService.manga.findMany({
      ...queryPayload,
      include: {
        chapters: {
          orderBy: {
            chapter_number: 'asc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const mangasCount = await this.prismaService.manga.aggregate({
      _count: true,
      where: queryPayload.where,
    });

    return {
      data: mangas.map((manga) => MangaWithDetailsMapper.toDto(manga)),
      totalCount: mangasCount._count,
    };
  }

  async create(manga: Manga): Promise<void> {
    const data = MangaMapper.toPersistence(manga);

    this.logger.log(JSON.stringify(data, undefined, 2));

    await this.prismaService.manga.create({
      data,
    });
  }

  async save(manga: Manga): Promise<void> {
    const data = MangaMapper.toPersistence(manga);

    this.logger.log(JSON.stringify(data, undefined, 2));

    await this.prismaService.manga.update({
      where: { id: manga.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.manga.delete({ where: { id } });
  }
}
