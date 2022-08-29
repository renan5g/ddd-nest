import { Scan } from '@modules/scans/domain/scan';
import { ScanWithDetails } from '@modules/scans/dtos';
import { SearchParams, SearchResult } from '@shared/dtos';

export type ExistsScanParams = {
  name?: string;
  email?: string;
};

export type FindByNameOrEmailParams = {
  name?: string;
  email?: string;
};

export type FindManyScansParams = {
  scan: string;
} & SearchParams;

export interface IScansRepository {
  exists(params: ExistsScanParams): Promise<boolean>;
  findById(id: string): Promise<Scan>;
  findBySlug(slug: string): Promise<Scan>;
  findByIdWithDetails(id: string): Promise<ScanWithDetails>;
  findBySlugWithDetails(slug: string): Promise<ScanWithDetails>;
  findByNameOrEmail(params: FindByNameOrEmailParams): Promise<Scan>;
  findMany(params: SearchParams): Promise<SearchResult<ScanWithDetails>>;
  create(scan: Scan): Promise<void>;
  save(scan: Scan): Promise<void>;
  delete(id: string): Promise<void>;
}
