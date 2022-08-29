import { UseCaseError } from '@core/domain/errors';
import { Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export class ChapterAlreadyExistsError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: ErrorMessages.CHAPTER_ALREADY_EXISTS,
    } as UseCaseError);
  }
}
