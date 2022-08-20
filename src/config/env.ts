import { randomUUID } from 'crypto';

export type EnvironmentVariables = typeof environments;

const environments = {
  http: {
    port: parseInt(process.env.PORT, 10) || 3333,
  },
  storage: {
    disk: process.env.STORAGE_DISK,
    server_url: process.env.APP_URL,
  },
  aws: {
    bucket: process.env.AWS_PUBLIC_BUCKET_NAME ?? 'nix-mangas',
    bucket_region: process.env.AWS_BUCKET_REGION ?? 'us-east-1',
    bucket_url: process.env.AWS_BUCKET_URL,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET ?? randomUUID(),
  },
};

export default () => environments;
