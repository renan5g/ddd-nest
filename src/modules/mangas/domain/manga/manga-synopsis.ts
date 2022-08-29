import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { InvalidTitleError } from './errors';

type MangaSynopsisProps = {
  value: string;
};

export class MangaSynopsis extends ValueObject<MangaSynopsisProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: MangaSynopsisProps) {
    super(props);
  }

  static validate(synopsis: string): boolean {
    if (
      !synopsis ||
      synopsis.trim().length < 2 ||
      synopsis.trim().length > 2000
    ) {
      return false;
    }

    return true;
  }

  public static create(props: MangaSynopsisProps): Result<MangaSynopsis> {
    const nullGuard = Guard.againstNullOrUndefined(props.value, 'synopsis');

    if (!nullGuard.succeeded) {
      return Result.fail<MangaSynopsis>(nullGuard.message);
    }

    if (!this.validate(props.value)) {
      return Result.fail<MangaSynopsis>(new InvalidTitleError());
    }

    return Result.ok<MangaSynopsis>(new MangaSynopsis(props));
  }
}
