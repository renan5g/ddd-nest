export interface IStorageProvider {
  save(file: string, folder: string, covert?: boolean): Promise<string>;
  delete(file: string, folder: string): Promise<void>;
}
