import { WatchedList } from '@core/domain';
import { ScanManga } from './scan-manga';

export class ScanMangas extends WatchedList<ScanManga> {
  private constructor(initialMangas: ScanManga[]) {
    super(initialMangas);
  }

  public compareItems(a: ScanManga, b: ScanManga): boolean {
    return a.equals(b);
  }

  public static create(initialMangas?: ScanManga[]): ScanMangas {
    return new ScanMangas(initialMangas || []);
  }
}
