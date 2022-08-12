import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'baianinhoo',
    description: 'Email ou username',
  })
  login: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    example: '12345678',
    description: 'Senha do usuário',
  })
  password: string;
}

export class TokenM {
  @ApiProperty()
  accessToken: string;
}
