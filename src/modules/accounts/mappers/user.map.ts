import { User as PersistenceUser } from '@infra/prisma';

import { User } from '@modules/accounts/domain/user';
import { Email, Name, Password } from '@shared/domain/value-objects';

export class UserMap {
  static toDomain(raw: PersistenceUser): User {
    const username = Name.create(raw.username);
    const email = Email.create(raw.email);
    const password = Password.create({
      value: raw.password,
      hashed: true,
    });

    const entityOrError = User.create({
      username: username.getValue(),
      email: email.getValue(),
      password: password.getValue(),
      accessToken: raw.access_token,
      isDeleted: raw.is_deleted,
      lastLogin: raw.last_login,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      deletedAt: raw.deleted_at,
    });

    if (entityOrError.isFailure) {
      console.log(entityOrError.error);
      return null;
    }

    return entityOrError.getValue();
  }

  static async toPersistence(entity: User) {
    return {
      id: entity.id,
      username: entity.username.value,
      email: entity.email.value,
      password: await entity.password.getHashedValue(),
      access_token: entity.accessToken,
      last_login: entity.lastLogin,
      is_deleted: entity.isDeleted,
      deleted_at: entity.deletedAt,
      updated_at: entity.updatedAt,
      created_at: entity.createdAt,
    };
  }
}
