import type { Response } from 'express';

import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { JWTAuthGuard } from '@infra/http/guards';
import { CreatePartnerInput } from '@modules/partners/dtos';
import { RegisterPartnerController } from '@modules/partners/usecases';

@ApiTags('Partners')
@ApiExtraModels()
@UseGuards(JWTAuthGuard)
@Controller({
  path: 'partners',
  version: '1',
})
export class PartnersRoutes {
  constructor(
    private readonly registerPartnerController: RegisterPartnerController,
  ) {}

  @Post('/new')
  async login(@Body() data: CreatePartnerInput, @Res() res: Response) {
    const httpResponse = await this.registerPartnerController.handle(data);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}
