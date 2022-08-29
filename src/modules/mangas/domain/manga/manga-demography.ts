import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export enum MangaDemographyEnum {
  'SEINEN' = 'seinen',
  'SHOUNNEN' = 'shounnen',
  'SHOUJO' = 'shoujo',
  'JOSEI' = 'josei',
}

export type IMangaDemography = keyof typeof MangaDemographyEnum;
export interface MangaDemographyProps {
  value: IMangaDemography;
}

export class MangaDemography extends ValueObject<MangaDemographyProps> {
  private constructor(props: MangaDemographyProps) {
    super(props);
  }

  get value(): IMangaDemography {
    return this.props.value.toUpperCase() as IMangaDemography;
  }

  public static isValidValue(value: IMangaDemography): boolean {
    return value.toUpperCase() in MangaDemographyEnum;
  }

  public static create(type: IMangaDemography): Result<MangaDemography> {
    const nullGuard = Guard.againstNullOrUndefined(type, 'manga type');

    if (!nullGuard.succeeded) {
      return Result.fail<MangaDemography>(nullGuard.message);
    }

    if (!this.isValidValue(type)) {
      return Result.fail<MangaDemography>(
        ErrorMessages.INVALID_ENUM_MANGA_TYPE,
      );
    }

    return Result.ok<MangaDemography>(new MangaDemography({ value: type }));
  }
}
