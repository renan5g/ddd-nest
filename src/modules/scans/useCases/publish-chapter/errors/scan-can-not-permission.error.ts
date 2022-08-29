import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class ScanCanNotPermissionError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.SCAN_NOT_PERMISSION,
    } as UseCaseError);
  }
}
