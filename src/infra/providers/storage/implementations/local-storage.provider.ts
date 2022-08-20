import { existsSync, promises } from 'node:fs';
import { resolve } from 'node:path';

import { tmpFolder } from '@config/upload';
import { Injectable } from '@nestjs/common';

import { IStorageProvider } from '@infra/providers/storage/models';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    if (!existsSync(`${tmpFolder}/${folder}`)) {
      await promises.mkdir(`${tmpFolder}/${folder}`, {
        recursive: true,
      });
    }

    await promises.rename(
      resolve(tmpFolder, file),
      resolve(`${tmpFolder}/${folder}`, file),
    );

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${tmpFolder}/${folder}`, file);

    try {
      await promises.stat(filename);
    } catch {
      return;
    }
    await promises.unlink(filename);
  }
}
