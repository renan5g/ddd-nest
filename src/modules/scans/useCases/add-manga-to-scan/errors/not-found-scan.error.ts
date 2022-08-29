import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class NotFoundScanError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.SCAN_NOT_FOUND,
    } as UseCaseError);
  }
}
