import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';

import { InvalidNameError } from './errors';

type NameProps = {
  value: string;
};

export class Name extends ValueObject<NameProps> {
  get value() {
    return this.props.value;
  }

  private constructor(props: NameProps) {
    super(props);
  }

  static validate(name: string): boolean {
    if (!name || name.trim().length < 2 || name.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(name: string): Result<Name> {
    const guardResult = Guard.againstNullOrUndefined(name, 'name');
    if (!guardResult.succeeded) {
      return Result.fail<Name>(guardResult.message);
    }

    if (!this.validate(name)) {
      return Result.fail<Name>(new InvalidNameError(name));
    }

    return Result.ok<Name>(
      new Name({
        value: name,
      }),
    );
  }
}
