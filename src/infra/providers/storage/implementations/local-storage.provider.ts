import { existsSync, promises } from 'node:fs';
import { resolve } from 'node:path';

import { tmpFolder } from '@config/upload';
import { Injectable } from '@nestjs/common';

import { avifOptions } from '@config/sharp';
import { IStorageProvider } from '@infra/providers/storage/models';
import { convertFileToAvif } from '@shared/utils';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string, covert = true): Promise<string> {
    if (!existsSync(`${tmpFolder}/${folder}`)) {
      await promises.mkdir(`${tmpFolder}/${folder}`, {
        recursive: true,
      });
    }

    if (covert) {
      const filepath = await convertFileToAvif(
        {
          filename: file,
          inputDir: tmpFolder,
          outputDir: folder,
        },
        avifOptions,
      );
      return filepath;
    } else {
      const outputDir = `${tmpFolder}/${folder}`;
      await promises.rename(resolve(tmpFolder, file), resolve(outputDir, file));
      return `${folder}/${file}`;
    }
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
