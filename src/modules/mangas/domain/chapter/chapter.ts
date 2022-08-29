import { BaseDomainEntity, Entity } from '@core/domain';
import { Guard, Result } from '@core/logic';
import { Link } from '@shared/domain/value-objects';
import { ChapterPage } from './chapter-page';

import { ChapterPages } from './chapter-pages';

type ChapterProps = {
  cover?: string;
  mangaId: string;
  scanId?: string;
  chapterNumber: string;
  title: string;
  link: Link;
  pagesCount?: number;
  pages?: ChapterPages;
  dateTimePosted?: Date;
} & BaseDomainEntity;

export class Chapter extends Entity<ChapterProps> {
  get mangaId() {
    return this.props.mangaId;
  }

  get scanId() {
    return this.props.scanId;
  }

  get cover() {
    return this.props.cover;
  }

  get chapterNumber() {
    return this.props.chapterNumber;
  }

  get title() {
    return this.props.title;
  }

  get link() {
    return this.props.link;
  }

  get pages() {
    return this.props.pages;
  }

  get dateTimePosted() {
    return this.props.dateTimePosted;
  }

  get pagesCount() {
    return this.props.pagesCount;
  }

  private constructor(props: ChapterProps, id?: string) {
    super(props, id);
  }

  public updateTotalNumberPages(numPages: number): void {
    if (numPages >= 0) {
      this.props.pagesCount = numPages;
    }
  }

  private removePageIfExists(page: ChapterPage): void {
    if (this.props.pages.exists(page)) {
      this.props.pages.remove(page);
    }
  }

  public updatePage(page: ChapterPage): Result<void> {
    this.removePageIfExists(page);
    this.props.pages.add(page);
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public addPage(page: ChapterPage): Result<void> {
    this.props.pages.add(page);
    this.props.pagesCount++;
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public changeCover(cover: string) {
    this.props.cover = cover;
    this.props.updatedAt = new Date();

    return Result.ok<void>();
  }

  static create(props: ChapterProps, id?: string): Result<Chapter> {
    const guardProps = [
      { argument: props.mangaId, argumentName: 'mangaId' },
      // { argument: props.scanId, argumentName: 'scanId' },
      { argument: props.title, argumentName: 'title' },
      { argument: props.chapterNumber, argumentName: 'chapterNumber' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardProps);
    if (!guardResult.succeeded) {
      return Result.fail<Chapter>(guardResult.message);
    }

    return Result.ok<Chapter>(
      new Chapter(
        {
          ...props,
          pages: props.pages ?? ChapterPages.create([]),
          dateTimePosted: props.dateTimePosted ?? new Date(),
          pagesCount: props.pagesCount ?? 0,
        },
        id,
      ),
    );
  }
}
