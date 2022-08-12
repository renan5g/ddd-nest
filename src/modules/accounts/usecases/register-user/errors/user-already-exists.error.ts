import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class UserAlreadyExistsError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.USER_ALREADY_EXIST,
    } as UseCaseError);
  }
}
