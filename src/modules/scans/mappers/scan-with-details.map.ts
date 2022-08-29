import { Scan } from '@infra/prisma';
import { ScanWithDetails } from '../dtos';

type PersistenceRaw = Scan;

export class ScanWithDetailsMapper {
  static toDto(raw: PersistenceRaw): ScanWithDetails {
    return {
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      label: raw.name,
      value: raw.slug,
      cover: raw.cover,
      link: raw.link,
      description: raw.description,
      discord: raw.discord,
      facebook: raw.facebook,
      website: raw.website,
    };
  }
}
