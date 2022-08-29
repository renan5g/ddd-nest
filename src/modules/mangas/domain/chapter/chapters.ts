import { WatchedList } from '@core/domain';
import { Chapter } from './chapter';

export class Chapters extends WatchedList<Chapter> {
  private constructor(initialChapter: Chapter[]) {
    super(initialChapter);
  }

  public compareItems(a: Chapter, b: Chapter): boolean {
    return a.equals(b);
  }

  public static create(initialChapter?: Chapter[]): Chapters {
    return new Chapters(initialChapter || []);
  }
}
