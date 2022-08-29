import { ScanManga, ScanMangas } from '@modules/scans/domain/scan';
import { ScanMangasDetails } from '@modules/scans/dtos';
import { SearchParams, SearchResult } from '@shared/dtos';

export type FindByScanAndMangaParams = {
  scanId: string;
  mangaId: string;
};

export type FindByScanAndMangasParams = {
  scanId: string;
  mangasIds: string[];
};

export type FindManyMangasByScanParams = {
  scan: string;
} & SearchParams;

export interface IScansMangasRepository {
  findManyMangasByScan(
    params: FindManyMangasByScanParams,
  ): Promise<SearchResult<ScanMangasDetails>>;
  findByScanAndManga(params: FindByScanAndMangaParams): Promise<ScanManga>;
  findByScanAndMangas(params: FindByScanAndMangasParams): Promise<ScanManga[]>;
  create(scanMangas: ScanMangas): Promise<void>;
  save(scanMangas: ScanMangas): Promise<void>;
}
