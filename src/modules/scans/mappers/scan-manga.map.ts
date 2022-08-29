import { ScanManga as PersistenceScanManga } from '@infra/prisma';

import { ScanManga } from '@modules/scans/domain/scan';

export class ScanMangaMapper {
  static toDomain(raw: PersistenceScanManga): ScanManga {
    const entityOrError = ScanManga.create(
      {
        mangaId: raw.manga_id,
        scanId: raw.scan_id,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
      },
      raw.id,
    );

    if (entityOrError.isFailure) {
      console.log(entityOrError.error);
      return null;
    }

    return entityOrError.getValue();
  }

  static toPersistence(entity: ScanManga) {
    return {
      id: entity.id,
      manga_id: entity.mangaId,
      scan_id: entity.scanId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
