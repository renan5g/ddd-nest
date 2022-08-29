import { Scan as PersistenceScan } from '@infra/prisma';
import { Scan, ScanSlug } from '@modules/scans/domain/scan';
import { Email, Name, Password } from '@shared/domain/value-objects';

type PersistenceRaw = PersistenceScan;

export class ScanMapper {
  static toDomain(raw: PersistenceRaw): Scan {
    const email = Email.create(raw.email).getValue();
    const name = Name.create(raw.name).getValue();
    const slug = ScanSlug.createFromExisting(raw.slug).getValue();
    const password = Password.create({
      value: raw.password,
      hashed: true,
    }).getValue();

    const entityOrError = Scan.create(
      {
        email,
        name,
        password,
        slug,
        link: raw.link,
        cover: raw.cover,
        description: raw.description,
        discord: raw.discord,
        facebook: raw.facebook,
        website: raw.website,
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

  static async toPersistence(entity: Scan) {
    return {
      id: entity.id,
      email: entity.email.value,
      name: entity.name.value,
      slug: entity.slug.value,
      password: await entity.password.getHashedValue(),
      link: entity.generateLink(),
      cover: entity.cover,
      description: entity.description,
      discord: entity.discord,
      facebook: entity.facebook,
      website: entity.website,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }
}
