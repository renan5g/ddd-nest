import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchInputParams {
  @ApiPropertyOptional()
  q?: string;

  @ApiPropertyOptional()
  perPage?: string;

  @ApiPropertyOptional()
  page: string;
}

export type SearchParams = {
  query?: string;
  perPage?: number;
  page: number;
};

export class SearchResult<TData> {
  @ApiProperty()
  totalCount: number;

  data: TData[];
}
