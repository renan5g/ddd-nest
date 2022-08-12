import { User } from '@modules/accounts/domain/user';

export type FindByEmailOrUsernameParams = {
  email: string;
  username: string;
};

export type ExistsUserParams = {
  email: string;
  username: string;
};

export interface IUsersRepository {
  exists(params: ExistsUserParams): Promise<boolean>;
  findById(id: string): Promise<User>;
  findByEmailOrUsername(params: FindByEmailOrUsernameParams): Promise<User>;
  save(user: User): Promise<void>;
  create(user: User): Promise<void>;
}
