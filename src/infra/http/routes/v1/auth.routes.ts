import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from '@infra/http/guards';
import { AuthenticateUserController } from '@modules/auth/usecases';
import { Request, Response } from 'express';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthRoutes {
  constructor(
    private readonly authenticateUserController: AuthenticateUserController,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/admin_session/new')
  async login(@Req() req: Request, @Res() res: Response) {
    const httpResponse = await this.authenticateUserController.handle(req.user);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
