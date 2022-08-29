import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class ScanAlreadyExistsError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.SCAN_ALREADY_EXISTS,
    } as UseCaseError);
  }
}
