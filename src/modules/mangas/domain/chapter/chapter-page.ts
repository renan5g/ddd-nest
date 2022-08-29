import { BaseDomainEntity, Entity } from '@core/domain';
import { Guard, Result } from '@core/logic';

type ChapterPageProps = {
  chapterId: string;
  pageNumber: number;
  pageUrl: string;
} & BaseDomainEntity;

export class ChapterPage extends Entity<ChapterPageProps> {
  get chapterId() {
    return this.props.chapterId;
  }

  get pageNumber() {
    return this.props.pageNumber;
  }

  get pageUrl() {
    return this.props.pageUrl;
  }

  private constructor(props: ChapterPageProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: ChapterPageProps,
    id?: string,
  ): Result<ChapterPage> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.pageNumber, argumentName: 'pageNumber' },
      { argument: props.chapterId, argumentName: 'chapterId' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<ChapterPage>(guardResult.message);
    }

    return Result.ok<ChapterPage>(new ChapterPage(props, id));
  }
}
