import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidGenreError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: ErrorMessages.GENRE_INVALID,
    } as DomainError);
  }
}
