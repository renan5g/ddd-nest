import { ApiProperty } from '@nestjs/swagger';

export class PaginationParams {
  query?: string;
  page: number;
  perPage: number;
}

export class PaginatedDto<TData> {
  @ApiProperty()
  totalCount: number;

  data: TData[];
}
