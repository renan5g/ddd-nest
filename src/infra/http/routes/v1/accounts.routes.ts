import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { ProfileM } from '@infra/docs/models';
import { CurrentUser, Public } from '@infra/http/decorators';
import { UserAuthGuard } from '@infra/http/guards';
import { CreateUserInput } from '@modules/accounts/dtos';
import {
  GetProfileController,
  RegisterUserController,
} from '@modules/accounts/usecases';
import { AuthUserDTO } from '@modules/auth/dtos';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@ApiExtraModels(ProfileM)
@Controller({
  path: 'accounts',
  version: '1',
})
export class AccountsRoutes {
  constructor(
    private readonly _registerUserController: RegisterUserController,
    private readonly _getProfileController: GetProfileController,
  ) {}

  @Public()
  @Post('reader/new')
  async registerGuest(@Body() data: CreateUserInput, @Res() res: Response) {
    const httpResponse = await this._registerUserController.handle(data);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @Post('admin/new')
  async registerAdmin(@Body() data: CreateUserInput, @Res() res: Response) {
    const httpResponse = await this._registerUserController.handle(data);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @Get('me')
  @ApiOkResponse({ type: ProfileM })
  async profile(@CurrentUser() user: AuthUserDTO, @Res() res: Response) {
    const httpResponse = await this._getProfileController.handle(user);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
