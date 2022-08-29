/*
  Warnings:

  - You are about to drop the column `url` on the `scans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "scans" DROP COLUMN "url",
ADD COLUMN     "link" TEXT;
