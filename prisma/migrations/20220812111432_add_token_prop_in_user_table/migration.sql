-- AlterTable
ALTER TABLE "users" ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "last_login" TIMESTAMP(3);
