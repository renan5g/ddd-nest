import * as AdmZip from 'adm-zip';
import { Request } from 'express';
import { stat, unlink } from 'fs/promises';
import { extname, join, resolve } from 'path';

import env from '@config/env';
import { tmpFolder } from '@config/upload';

export async function editFileName(
  req: Request,
  file: Express.Multer.File,
  callback,
) {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  console.log(fileExtName);

  callback(null, `${name}-${randomName}${fileExtName}`);
}

export async function imageFileFilter(
  req: Request,
  file: Express.Multer.File,
  callback,
) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|zip|webp|avif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
}

export async function pdfFilter(
  req: Request,
  file: Express.Multer.File,
  callback,
) {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
}

export async function extractArchive(
  file: string,
  folder: string,
): Promise<string[]> {
  try {
    const filename = resolve(tmpFolder, file);

    const zip = new AdmZip(filename);
    const outputDir = join(`${tmpFolder}/${folder}`);
    zip.extractAllTo(outputDir);

    try {
      await stat(`${tmpFolder}/${file}`);
    } catch {
      return;
    }
    await unlink(`${tmpFolder}/${file}`);
  } catch (err) {
    console.log(err);
  }
}

export function getStoredFileURL(file: string): string {
  if (!file) return null;

  switch (env().storage.disk) {
    case 'local':
      return `${env().storage.server_url}/${file}`;
    case 's3':
      return `${env().aws.bucket_url}/${file}`;
    default:
      return null;
  }
}
