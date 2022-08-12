import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CurrentUser } from '@infra/http/decorators';
import { JWTAuthGuard } from '@infra/http/guards';
import { CreateUserDTO } from '@modules/accounts/dtos';
import {
  GetProfileController,
  RegisterUserController,
} from '@modules/accounts/usecases';
import { AuthUserDTO } from '@modules/auth/dtos';

@ApiTags('Accounts')
@UseGuards(JWTAuthGuard)
@Controller({
  path: 'accounts',
  version: '1',
})
export class AccountsRoutes {
  constructor(
    private readonly registerUserController: RegisterUserController,
    private readonly getProfileController: GetProfileController,
  ) {}

  @Post('admin/new')
  async register(@Body() data: CreateUserDTO, @Res() res: Response) {
    const httpResponse = await this.registerUserController.handle(data);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @Get('me')
  async profile(@CurrentUser() user: AuthUserDTO, @Res() res: Response) {
    const httpResponse = await this.getProfileController.handle(user);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
