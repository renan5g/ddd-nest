import { SetMetadata } from '@nestjs/common';

export const IS_SCAN_KEY = 'isScan';
export const Scan = () => SetMetadata(IS_SCAN_KEY, true);
