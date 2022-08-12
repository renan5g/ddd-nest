import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { JWTAuthGuard } from '@infra/http/guards';
import { CreateUserDTO } from '@modules/accounts/dtos';
import { RegisterUserController } from '@modules/accounts/usecases';

@ApiTags('Accounts')
@UseGuards(JWTAuthGuard)
@Controller({
  path: 'accounts',
  version: '1',
})
export class AccountsRoutes {
  constructor(
    private readonly registerUserController: RegisterUserController,
  ) {}

  @Post('/admin/new')
  async register(@Body() data: CreateUserDTO, @Res() res: Response) {
    const httpResponse = await this.registerUserController.handle(data);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @Get('me')
  async profile() {
    return { success: true };
  }
}
