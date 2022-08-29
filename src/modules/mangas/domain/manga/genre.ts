import { BaseDomainEntity, Entity } from '@core/domain';
import { Either, Guard, left, Result } from '@core/logic';

import { InvalidGenreError } from './errors';

type GenreProps = {
  name: string;
} & BaseDomainEntity;

export class Genre extends Entity<GenreProps> {
  get name(): string {
    return this.props.name;
  }

  private constructor(props: GenreProps) {
    super(props);
  }

  static validate(genre: string): boolean {
    if (!genre || genre.trim().length < 2 || genre.trim().length > 255) {
      return false;
    }

    return true;
  }

  public changeName(name: string): Either<Result<any>, Result<void>> {
    if (!Genre.validate(name)) {
      return left(Result.fail<Genre>(new InvalidGenreError()));
    }
    this.props.name = name;
  }

  public static create(props: GenreProps): Result<Genre> {
    const nullGuard = Guard.againstNullOrUndefined(props.name, 'name');

    if (!nullGuard.succeeded) {
      return Result.fail<Genre>(nullGuard.message);
    }

    if (!this.validate(props.name)) {
      return Result.fail<Genre>(new InvalidGenreError());
    }

    return Result.ok<Genre>(new Genre(props));
  }
}
