import { DomainError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class InvalidCNPJError extends Result<DomainError> {
  constructor(CNPJ: string) {
    super(false, {
      message: ErrorMessages.INVALID_PARAM('CNPJ', CNPJ),
    } as DomainError);
  }
}
