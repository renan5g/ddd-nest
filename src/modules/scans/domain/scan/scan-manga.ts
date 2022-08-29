import { BaseDomainEntity, Entity } from '@core/domain';
import { Guard, Result } from '@core/logic';

type ScanMangaProps = {
  mangaId: string;
  scanId: string;
} & BaseDomainEntity;

export class ScanManga extends Entity<ScanMangaProps> {
  get mangaId() {
    return this.props.mangaId;
  }

  get scanId() {
    return this.props.scanId;
  }

  private constructor(props: ScanMangaProps, id?: string) {
    super(props, id);
  }

  public static create(props: ScanMangaProps, id?: string): Result<ScanManga> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.mangaId, argumentName: 'mangaId' },
      { argument: props.scanId, argumentName: 'scanId' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<ScanManga>(guardResult.message);
    }

    return Result.ok<ScanManga>(new ScanManga(props, id));
  }
}
