import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { InvalidTitleError } from './errors';

type MangaTitleProps = {
  value: string;
};

export class MangaTitle extends ValueObject<MangaTitleProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: MangaTitleProps) {
    super(props);
  }

  static validate(title: string): boolean {
    if (!title || title.trim().length < 2 || title.trim().length > 255) {
      return false;
    }

    return true;
  }

  public static create(props: MangaTitleProps): Result<MangaTitle> {
    const nullGuard = Guard.againstNullOrUndefined(props.value, 'title');

    if (!nullGuard.succeeded) {
      return Result.fail<MangaTitle>(nullGuard.message);
    }

    if (!this.validate(props.value)) {
      return Result.fail<MangaTitle>(new InvalidTitleError());
    }

    return Result.ok<MangaTitle>(new MangaTitle(props));
  }
}
