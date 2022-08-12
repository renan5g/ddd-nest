import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Email do usuário',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    example: 'name',
    description: 'Nome de usuário',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @ApiProperty({
    example: '2022@pass',
    description: 'Senha do usuário',
  })
  password: string;
}
