import type { Request, Response } from 'express';

import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginInput, TokenM } from '@infra/docs/models';
import { LocalScanAuthGuard, LocalUserAuthGuard } from '@infra/http/guards';
import {
  AuthenticateScanController,
  AuthenticateUserController,
} from '@modules/auth/usecases';

@ApiTags('Auth')
@ApiExtraModels(LoginInput, TokenM)
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthRoutes {
  constructor(
    private readonly _authenticateUserController: AuthenticateUserController,
    private readonly _authenticateScanController: AuthenticateScanController,
  ) {}

  // @UseGuards(UserLocalAuthGuard)
  // @ApiBody({ type: LoginInput })
  // @ApiOkResponse({ type: TokenM })
  // @Post('admin_session/new')
  // async loginAdmin(@Req() req: Request, @Res() res: Response) {
  //   const httpResponse = await this.authenticateUserController.handle(req.user);
  //   return res.status(httpResponse.statusCode).json(httpResponse.body);
  // }

  @UseGuards(LocalUserAuthGuard)
  @ApiBody({ type: LoginInput })
  @ApiOkResponse({ type: TokenM })
  @Post('reader_session/new')
  async loginReader(@Req() req: Request, @Res() res: Response) {
    const httpResponse = await this._authenticateUserController.handle(
      req.user,
    );
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }

  @UseGuards(LocalScanAuthGuard)
  @ApiBody({ type: LoginInput })
  @ApiOkResponse({ type: TokenM })
  @Post('scan_session/new')
  async loginScan(@Req() req: Request, @Res() res: Response) {
    const httpResponse = await this._authenticateScanController.handle(
      req.user,
    );
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
