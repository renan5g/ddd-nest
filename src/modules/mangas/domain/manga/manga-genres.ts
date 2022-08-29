import { WatchedList } from '@core/domain';
import { Genre } from './genre';

export class MangaGenres extends WatchedList<Genre> {
  private constructor(initialGenres: Genre[]) {
    super(initialGenres);
  }

  public compareItems(a: Genre, b: Genre): boolean {
    return a.equals(b);
  }

  public static create(genres?: Genre[]): MangaGenres {
    return new MangaGenres(genres || []);
  }
}
