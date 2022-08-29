import { Injectable, Logger } from '@nestjs/common';

import { Prisma, PrismaService } from '@infra/prisma';
import { ScanManga, ScanMangas } from '@modules/scans/domain/scan';
import { ScanMangasDetails } from '@modules/scans/dtos';
import { ScanMangaMapper } from '@modules/scans/mappers';
import { ScanMangaDetailsMapper } from '@modules/scans/mappers/scan-manga-details.map';
import {
  FindByScanAndMangaParams,
  FindByScanAndMangasParams,
  FindManyMangasByScanParams,
  IScansMangasRepository,
} from '@modules/scans/repositories/models';
import { SearchResult } from '@shared/dtos';

@Injectable()
export class PrismaScansMangasRepository implements IScansMangasRepository {
  private readonly logger = new Logger(PrismaScansMangasRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async findManyMangasByScan({
    page,
    perPage,
    query,
    scan,
  }: FindManyMangasByScanParams): Promise<SearchResult<ScanMangasDetails>> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {} as Prisma.ScanMangaWhereInput,
    };

    if (query) {
      queryPayload.where = {
        scan: {
          slug: scan,
        },
        manga: {
          OR: [
            { alternative_titles: { has: query } },
            { title: { contains: query, mode: 'insensitive' } },
          ],
        },
      };
    } else {
      queryPayload.where = {
        scan: {
          slug: scan,
        },
      };
    }

    const mangas = await this.prismaService.scanManga.findMany({
      ...queryPayload,
      include: {
        manga: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const scansCount = await this.prismaService.scanManga.aggregate({
      _count: true,
      where: queryPayload.where,
    });

    return {
      data: mangas.map((scan) => ScanMangaDetailsMapper.toDto(scan)),
      totalCount: scansCount._count,
    };
  }

  async findByScanAndManga({
    mangaId,
    scanId,
  }: FindByScanAndMangaParams): Promise<ScanManga> {
    const scanManga = await this.prismaService.scanManga.findUnique({
      where: {
        manga_id_scan_id: {
          manga_id: mangaId,
          scan_id: scanId,
        },
      },
    });

    if (!scanManga) return null;

    return ScanMangaMapper.toDomain(scanManga);
  }
  async findByScanAndMangas({
    scanId,
    mangasIds,
  }: FindByScanAndMangasParams): Promise<ScanManga[]> {
    const scanMangas = await this.prismaService.scanManga.findMany({
      where: {
        scan_id: scanId,
        manga_id: {
          in: mangasIds,
        },
      },
    });

    return scanMangas.map((scanManga) => ScanMangaMapper.toDomain(scanManga));
  }

  async create(scanMangas: ScanMangas): Promise<void> {
    const data = scanMangas
      .getItems()
      .map((scanManga) => ScanMangaMapper.toPersistence(scanManga));

    await this.prismaService.scanManga.createMany({
      data,
    });
  }

  async save(scanMangas: ScanMangas): Promise<void> {
    if (scanMangas.getNewItems().length > 0) {
      const data = scanMangas
        .getNewItems()
        .map((scanManga) => ScanMangaMapper.toPersistence(scanManga));

      this.logger.log(JSON.stringify(data, undefined, 2));

      await this.prismaService.scanManga.createMany({
        data,
        skipDuplicates: true,
      });
    }

    if (scanMangas.getRemovedItems().length > 0) {
      const removedIds = scanMangas
        .getRemovedItems()
        .map((scanManga) => scanManga.id);

      this.logger.log(JSON.stringify(removedIds, undefined, 2));

      await this.prismaService.scanManga.deleteMany({
        where: {
          id: {
            in: removedIds,
          },
        },
      });
    }
  }
}
