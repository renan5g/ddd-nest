import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/prisma';
import { Scan } from '@modules/scans/domain/scan';
import { ScanWithDetails } from '@modules/scans/dtos';
import { ScanMapper, ScanWithDetailsMapper } from '@modules/scans/mappers';
import {
  ExistsScanParams,
  FindByNameOrEmailParams,
  IScansRepository,
} from '@modules/scans/repositories/models';
import { SearchParams, SearchResult } from '@shared/dtos';
import { PrismaScansMangasRepository } from './prisma-scans-mangas.repository';

@Injectable()
export class PrismaScansRepository implements IScansRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly scansMangasRepository: PrismaScansMangasRepository,
  ) {}

  async exists({ email, name }: ExistsScanParams): Promise<boolean> {
    const scan = await this.prismaService.scan.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            email,
          },
        ],
      },
    });

    return !!scan;
  }

  async findByNameOrEmail({
    email,
    name,
  }: FindByNameOrEmailParams): Promise<Scan> {
    const scan = await this.prismaService.scan.findFirst({
      where: {
        OR: [
          {
            slug: name,
          },
          {
            email,
          },
        ],
      },
    });

    if (!scan) return null;

    return ScanMapper.toDomain(scan);
  }

  async findById(id: string): Promise<Scan> {
    const scan = await this.prismaService.scan.findUnique({
      where: { id },
    });

    if (!scan) return null;

    return ScanMapper.toDomain(scan);
  }

  async findBySlug(slug: string): Promise<Scan> {
    const scan = await this.prismaService.scan.findUnique({
      where: { slug },
    });

    if (!scan) return null;

    return ScanMapper.toDomain(scan);
  }

  async findByIdWithDetails(id: string): Promise<ScanWithDetails> {
    const scan = await this.prismaService.scan.findUnique({
      where: {
        id,
      },
    });

    if (!scan) return null;

    return ScanWithDetailsMapper.toDto(scan);
  }

  async findBySlugWithDetails(slug: string): Promise<ScanWithDetails> {
    const scan = await this.prismaService.scan.findUnique({
      where: {
        slug,
      },
    });

    if (!scan) return null;

    return ScanWithDetailsMapper.toDto(scan);
  }

  async findMany({
    page,
    perPage,
    query,
  }: SearchParams): Promise<SearchResult<ScanWithDetails>> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    };

    if (query) {
      queryPayload.where = {
        OR: [{ name: { contains: query, mode: 'insensitive' } }],
      };
    }

    const scans = await this.prismaService.scan.findMany({
      ...queryPayload,
      orderBy: {
        created_at: 'desc',
      },
    });

    const scansCount = await this.prismaService.scan.aggregate({
      _count: true,
      where: queryPayload.where,
    });

    return {
      data: scans.map((scan) => ScanWithDetailsMapper.toDto(scan)),
      totalCount: scansCount._count,
    };
  }

  async create(scan: Scan): Promise<void> {
    const data = await ScanMapper.toPersistence(scan);
    await this.prismaService.scan.create({
      data,
    });

    await this.scansMangasRepository.create(scan.mangas);
  }

  async save(scan: Scan): Promise<void> {
    const data = await ScanMapper.toPersistence(scan);
    await this.prismaService.scan.update({
      where: { id: scan.id },
      data,
    });

    await this.scansMangasRepository.save(scan.mangas);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.scan.delete({ where: { id } });
  }
}
