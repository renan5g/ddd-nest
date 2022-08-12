import * as bcrypt from 'bcrypt';

import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { InvalidPasswordLengthError } from './errors';

type PasswordProps = {
  value: string;
  hashed?: boolean;
};

export class Password extends ValueObject<PasswordProps> {
  get value() {
    return this.props.value;
  }

  private constructor(props: PasswordProps) {
    super(props);
  }

  static validate(password: string): boolean {
    if (
      !password ||
      password.trim().length < 6 ||
      password.trim().length > 255
    ) {
      return false;
    }

    return true;
  }

  public async getHashedValue(): Promise<string> {
    if (this.props.hashed) {
      return this.props.value;
    }

    return await bcrypt.hash(this.props.value, 8);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;

    if (this.props.hashed) {
      hashed = this.props.value;

      return await bcrypt.compare(plainTextPassword, hashed);
    }

    return this.props.value === plainTextPassword;
  }

  static create(props: PasswordProps): Result<Password> {
    const guardResult = Guard.againstNullOrUndefined(props.value, 'password');
    if (!guardResult.succeeded) {
      return Result.fail<Password>(guardResult.message);
    }

    if (!this.validate(props.value)) {
      return Result.fail<Password>(new InvalidPasswordLengthError());
    }

    return Result.ok<Password>(
      new Password({
        value: props.value,
        hashed: props.hashed ?? false,
      }),
    );
  }
}
