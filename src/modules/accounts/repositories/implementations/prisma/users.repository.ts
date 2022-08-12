import { PrismaService } from '@infra/prisma';

import { User } from '@modules/accounts/domain/user';
import { UserMap } from '@modules/accounts/mappers';
import {
  ExistsUserParams,
  FindByEmailOrUsernameParams,
  IUsersRepository,
} from '@modules/accounts/repositories/models';

export class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async exists({ email, username }: ExistsUserParams): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    return !!user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return UserMap.toDomain(user);
  }

  async findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParams): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (!user) return null;

    return UserMap.toDomain(user);
  }

  async save(user: User): Promise<void> {
    const data = await UserMap.toPersistence(user);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data,
    });
  }

  async create(user: User): Promise<void> {
    const data = await UserMap.toPersistence(user);

    await this.prismaService.user.create({
      data,
    });
  }
}
