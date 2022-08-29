import { WatchedList } from '@core/domain';
import { MangaTitle } from './manga-title';

export class MangaAlternativeTitles extends WatchedList<MangaTitle> {
  private constructor(initialMangaTitles: MangaTitle[]) {
    super(initialMangaTitles);
  }

  public compareItems(a: MangaTitle, b: MangaTitle): boolean {
    return a.equals(b);
  }

  public static create(MangaTitles?: MangaTitle[]): MangaAlternativeTitles {
    return new MangaAlternativeTitles(MangaTitles || []);
  }
}
