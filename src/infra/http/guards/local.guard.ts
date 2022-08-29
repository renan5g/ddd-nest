import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalUserAuthGuard extends AuthGuard('local.user') {}

@Injectable()
export class LocalScanAuthGuard extends AuthGuard('local.scan') {}
