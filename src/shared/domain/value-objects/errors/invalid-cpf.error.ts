import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidCPFError extends Result<DomainError> {
  constructor(CPF: string) {
    super(false, {
      message: ErrorMessages.INVALID_PARAM('CPF', CPF),
    } as DomainError);
  }
}
