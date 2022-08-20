import { ApiProperty } from '@nestjs/swagger';

export class TokenM {
  @ApiProperty()
  accessToken: string;
}
