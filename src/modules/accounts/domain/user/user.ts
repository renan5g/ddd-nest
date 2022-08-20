import { BaseDomainEntity, Entity } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { Email, Name, Password } from '@shared/domain/value-objects';

type UserProps = {
  email: Email;
  username: Name;
  password: Password;
  isDeleted?: boolean;
  accessToken?: string;
  deletedAt?: Date;
  lastLogin?: Date;
} & BaseDomainEntity;

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email;
  }

  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.password;
  }

  get accessToken() {
    return this.props.accessToken;
  }

  get isDeleted() {
    return this.props.isDeleted;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  get lastLogin() {
    return this.props.lastLogin;
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken;
  }

  public setAccessToken(token: string) {
    this.props.accessToken = token;
    this.props.lastLogin = new Date();
    this.props.updatedAt = new Date();
  }

  public delete() {
    if (!this.props.isDeleted) {
      this.props.isDeleted = true;
      this.props.deletedAt = new Date();
      this.props.updatedAt = new Date();
    }
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: 'email' },
      { argument: props.username, argumentName: 'username' },
      { argument: props.password, argumentName: 'password' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    }

    return Result.ok<User>(
      new User(
        {
          ...props,
          isDeleted: props.isDeleted ?? false,
        },
        id,
      ),
    );
  }
}
