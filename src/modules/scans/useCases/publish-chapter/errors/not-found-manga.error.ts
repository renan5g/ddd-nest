import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class NotFoundMangaError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.MANGA_DOES_NOT_EXISTS,
    } as UseCaseError);
  }
}
