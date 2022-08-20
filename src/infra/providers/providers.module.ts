import { Module } from '@nestjs/common';

import { StorageModule } from './storage/storage.module';

@Module({
  providers: [StorageModule],
})
export class ProvidersModule {}
