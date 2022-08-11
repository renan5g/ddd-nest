import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidPasswordLengthError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: ErrorMessages.INVALID_PASSWORD,
    } as DomainError);
  }
}
