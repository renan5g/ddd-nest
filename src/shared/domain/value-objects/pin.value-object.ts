import { ValueObject } from '@core/domain';
import { Result } from '@core/logic';
import { InvalidPINError } from './errors';

type PinProps = {
  value: string;
};

export class PIN extends ValueObject<PinProps> {
  private static numberDigits = 4;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PinProps) {
    super(props);
  }

  public isCodeValid(code: string): boolean {
    return this.value === code;
  }

  static validate(code: string): boolean {
    if (!code || code.trim().length > this.numberDigits) return false;

    return true;
  }

  static create(rawCode?: string): Result<PIN> {
    if (!this.validate(rawCode)) {
      return Result.fail<PIN>(new InvalidPINError(rawCode));
    }

    const chars = '0123456789';
    let code = '';

    for (let i = this.numberDigits; i > 0; --i) {
      code += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    return Result.ok<PIN>(new PIN({ value: rawCode ?? code }));
  }
}
