import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidEmailError extends Result<DomainError> {
  constructor(email: string) {
    super(false, {
      message: ErrorMessages.INVALID_PARAM('email', email),
    } as DomainError);
  }
}
