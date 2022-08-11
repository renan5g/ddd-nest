import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidNameError extends Result<DomainError> {
  constructor(name: string) {
    super(false, {
      message: ErrorMessages.INVALID_PARAM('name', name),
    } as DomainError);
  }
}
