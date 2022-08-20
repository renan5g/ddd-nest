import { S3 } from 'aws-sdk';
import promises from 'fs/promises';
import mime from 'mime';
import { resolve } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { tmpFolder } from '@config/upload';
import { IStorageProvider } from '@infra/providers/storage/models';

@Injectable()
class S3StorageProvider implements IStorageProvider {
  private client: S3;
  private AWS_BUCKET: string;

  constructor(private configService: ConfigService) {
    this.AWS_BUCKET = this.configService.get('AWS_PUBLIC_BUCKET_NAME');
    this.client = new S3({
      region: this.configService.get('AWS_BUCKET_REGION'),
    });
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = resolve(tmpFolder, file);

    const fileContent = await promises.readFile(originalName);

    const ContentType = mime.getType(originalName);

    await this.client
      .putObject({
        Bucket: `${this.AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await promises.unlink(originalName);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: `${this.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}

export { S3StorageProvider };
