import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { ValidatorUtil } from '@shared/utils';

import { InvalidEmailError } from './errors';

type EmailProps = {
  value: string;
};

export class Email extends ValueObject<EmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  static validate(email: string): boolean {
    if (!email || email.trim().length > 255) {
      return false;
    }

    if (!ValidatorUtil.isEmail(email)) {
      return false;
    }

    return true;
  }

  static format(email: string) {
    return email.trim().toLowerCase();
  }

  static create(email: string): Result<Email> {
    const guardResult = Guard.againstNullOrUndefined(email, 'email');
    if (!guardResult.succeeded) {
      return Result.fail<Email>(guardResult.message);
    }

    if (!this.validate(email)) {
      return Result.fail<Email>(new InvalidEmailError(email));
    }

    const formattedEmail = this.format(email);

    return Result.ok<Email>(new Email({ value: formattedEmail }));
  }
}
