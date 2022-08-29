import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TOKENS } from '@shared/constants';
import { LocalStorageProvider } from './implementations/local-storage.provider';
import { S3StorageProvider } from './implementations/s3-storage.provider';

const storageProvider: Provider = {
  provide: TOKENS.STORAGE_PROVIDER,
  useFactory: async (configService: ConfigService) => {
    const diskStorage = configService.get('STORAGE_DISK');

    const localStorageProvider = new LocalStorageProvider();
    const s3StorageProvider = new S3StorageProvider(configService);

    return diskStorage === 'S3' ? s3StorageProvider : localStorageProvider;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [storageProvider],
  exports: [TOKENS.STORAGE_PROVIDER],
})
export class StorageModule {}
