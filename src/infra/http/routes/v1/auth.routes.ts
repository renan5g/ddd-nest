import type { Request, Response } from 'express';

import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginDTO, TokenM } from '@infra/docs/models';
import { LocalAuthGuard } from '@infra/http/guards';
import { AuthenticateUserController } from '@modules/auth/usecases';

@ApiTags('Auth')
@ApiExtraModels(LoginDTO, TokenM)
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthRoutes {
  constructor(
    private readonly authenticateUserController: AuthenticateUserController,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ type: TokenM })
  @Post('/admin_session/new')
  async login(@Req() req: Request, @Res() res: Response) {
    const httpResponse = await this.authenticateUserController.handle(req.user);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
