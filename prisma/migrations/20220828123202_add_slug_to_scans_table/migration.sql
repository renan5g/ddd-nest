-- AlterTable
ALTER TABLE "scans" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "scans_slug_key" ON "scans"("slug");
