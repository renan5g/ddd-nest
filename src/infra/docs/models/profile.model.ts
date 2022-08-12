import { ApiProperty } from '@nestjs/swagger';

export class ProfileM {
  @ApiProperty({
    example: '859b9ff8-aefa-4b6a-b694-4372679e4703',
  })
  id: string;

  @ApiProperty({
    example: 'baianinhoo',
  })
  username: string;

  @ApiProperty({
    example: 'mail@example.com',
  })
  email: string;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  lastLogin: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
