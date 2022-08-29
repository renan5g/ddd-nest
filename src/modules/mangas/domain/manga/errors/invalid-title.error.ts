import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidTitleError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: ErrorMessages.TITLE_INVALID,
    } as DomainError);
  }
}
