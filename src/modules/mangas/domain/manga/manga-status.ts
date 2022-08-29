import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export enum MangaStatusEnum {
  'COMPLETED' = 'COMPLETED',
  'HIATO' = 'HIATO',
  'ACTIVE' = 'ACTIVE',
  'CANCELLED' = 'CANCELLED',
}

export type IMangaStatus = keyof typeof MangaStatusEnum;
export interface MangaStatusProps {
  value: IMangaStatus;
}

export class MangaStatus extends ValueObject<MangaStatusProps> {
  private constructor(props: MangaStatusProps) {
    super(props);
  }

  get value(): IMangaStatus {
    return this.props.value.toUpperCase() as IMangaStatus;
  }

  public static isValidValue(value: IMangaStatus): boolean {
    return value.toUpperCase() in MangaStatusEnum;
  }

  public static create(type: IMangaStatus): Result<MangaStatus> {
    const nullGuard = Guard.againstNullOrUndefined(type, 'status');

    if (!nullGuard.succeeded) {
      return Result.fail<MangaStatus>(nullGuard.message);
    }

    if (!this.isValidValue(type)) {
      return Result.fail<MangaStatus>(ErrorMessages.INVALID_ENUM_MANGA_STATUS);
    }

    return Result.ok<MangaStatus>(new MangaStatus({ value: type }));
  }
}
