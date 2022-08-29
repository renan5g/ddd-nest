import { avifOptions } from '@config/sharp';
import { tmpFolder } from '@config/upload';
import * as AdmZip from 'adm-zip';
import { Request } from 'express';
import { existsSync, readdirSync } from 'fs';
import { mkdir, stat, unlink } from 'fs/promises';
import { extname, join, resolve } from 'path';
import * as sharp from 'sharp';

export class FileUtil {}

export async function convertFileToAvif(
  { inputDir, outputDir, filename },
  config: sharp.AvifOptions,
) {
  try {
    if (!existsSync(`${tmpFolder}/${outputDir}`)) {
      await mkdir(`${tmpFolder}/${outputDir}`, {
        recursive: true,
      });
    }

    const filePath = join(inputDir, filename);
    const fileOut = join(
      `${tmpFolder}/${outputDir}`,
      `${filename.split('.')[0]}.avif`,
    );

    await sharp(filePath).toFormat('avif').avif(config).toFile(fileOut);

    try {
      await stat(filePath);
    } catch {
      return;
    }
    await unlink(filePath);

    return `${outputDir}/${filename.split('.')[0]}.avif`;
  } catch (err) {
    console.log(err);
  }
}

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

export async function extractArchive(
  file: string,
  folder: string,
): Promise<string[]> {
  try {
    const filename = resolve(tmpFolder, file);

    const zip = new AdmZip(filename);
    const outputDir = join(`${tmpFolder}/${folder}`);
    zip.extractAllTo(outputDir);

    const files = readdirSync(outputDir);

    const filePromises = files.map((file) =>
      convertFileToAvif(
        {
          filename: file,
          inputDir: outputDir,
          outputDir: `${folder}`,
        },
        avifOptions,
      ),
    );

    const filesCompressed = await Promise.all(filePromises);

    try {
      await stat(`${tmpFolder}/${file}`);
    } catch {
      return;
    }
    await unlink(`${tmpFolder}/${file}`);

    return filesCompressed;
  } catch (err) {
    console.log(err);
  }
}

export function getStorageFileURL(file: string) {
  if (!file) return null;

  switch (process.env.STORAGE_DISK) {
    case 'local':
      return `${process.env.APP_API_URL}/${file}`;
    case 's3':
      return `${process.env.AWS_BUCKET_URL}/${file}`;
    default:
      return null;
  }
}

export async function rollbackFilesUpload(...files: string[]) {
  for (const file of files) {
    if (!file) return;
    const filename = join(tmpFolder, file);

    try {
      await stat(filename);
    } catch {
      return;
    }
    await unlink(filename);
  }
}
