import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class MangaAlreadyExitsError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.MANGA_ALREADY_EXISTS,
    } as UseCaseError);
  }
}
