import { ValueObject } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { ErrorMessages } from '@shared/errors';

export enum MangaTypeEnum {
  'MANGA' = 'mangá',
  'MANHUA' = 'manhua',
  'MANHWA' = 'manhwa',
  'NOVEL' = 'novel',
  'SPINOFF' = 'spin-off',
}

export type IMangaType = keyof typeof MangaTypeEnum;
export interface MangaTypeProps {
  value: IMangaType;
}

export class MangaType extends ValueObject<MangaTypeProps> {
  private constructor(props: MangaTypeProps) {
    super(props);
  }

  get value(): IMangaType {
    return this.props.value.toUpperCase() as IMangaType;
  }

  public static isValidValue(value: IMangaType): boolean {
    return value.toUpperCase() in MangaTypeEnum;
  }

  public static create(type: IMangaType): Result<MangaType> {
    const nullGuard = Guard.againstNullOrUndefined(type, 'manga type');

    if (!nullGuard.succeeded) {
      return Result.fail<MangaType>(nullGuard.message);
    }

    if (!this.isValidValue(type)) {
      return Result.fail<MangaType>(ErrorMessages.INVALID_ENUM_MANGA_TYPE);
    }

    return Result.ok<MangaType>(new MangaType({ value: type }));
  }
}
