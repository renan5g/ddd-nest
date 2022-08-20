import { editFileName } from '@shared/utils';
import { diskStorage } from 'multer';
import { resolve } from 'path';

export const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

export const storage = diskStorage({
  destination: tmpFolder,
  filename: editFileName,
});
