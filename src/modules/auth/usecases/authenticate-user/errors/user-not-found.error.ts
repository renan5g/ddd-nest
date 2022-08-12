import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class UserNotFoundError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.USER_DOES_NOT_EXIST,
    } as UseCaseError);
  }
}
