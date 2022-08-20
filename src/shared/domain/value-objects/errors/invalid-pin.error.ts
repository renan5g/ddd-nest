import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidPINError extends Result<DomainError> {
  constructor(PIN: string) {
    super(false, {
      message: ErrorMessages.INVALID_PARAM('PIN', PIN),
    } as DomainError);
  }
}
