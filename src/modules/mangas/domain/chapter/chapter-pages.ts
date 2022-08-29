import { WatchedList } from '@core/domain';
import { ChapterPage } from './chapter-page';

export class ChapterPages extends WatchedList<ChapterPage> {
  private constructor(initialPages: ChapterPage[]) {
    super(initialPages);
  }

  public compareItems(a: ChapterPage, b: ChapterPage): boolean {
    return a.equals(b);
  }

  public static create(initialPages?: ChapterPage[]): ChapterPages {
    return new ChapterPages(initialPages || []);
  }
}
