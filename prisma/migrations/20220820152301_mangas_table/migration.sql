-- CreateEnum
CREATE TYPE "MangaStatus" AS ENUM ('COMPLETED', 'HIATO', 'ACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MangaFormat" AS ENUM ('MANGA', 'MANHUA', 'MANHWA', 'NOVEL', 'SPINOFF');

-- CreateEnum
CREATE TYPE "MangaDemography" AS ENUM ('SHOUNNEN', 'SHOUJO', 'SEINEN', 'JOSEI');

-- CreateTable
CREATE TABLE "mangas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "alternative_titles" TEXT[],
    "genres" TEXT[],
    "synopsis" TEXT NOT NULL,
    "author" TEXT,
    "artist" TEXT,
    "status" "MangaStatus" NOT NULL,
    "format" "MangaFormat" NOT NULL,
    "demography" "MangaDemography" NOT NULL,
    "poster" TEXT,
    "cover" TEXT,
    "chapters_count" INTEGER,
    "last_published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mangas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "chapter_number" TEXT NOT NULL,
    "cover" TEXT,
    "title" TEXT,
    "link" TEXT,
    "date_time_posted" TIMESTAMP(3),
    "pages_count" INTEGER,
    "manga_id" TEXT NOT NULL,
    "scan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters_pages" (
    "id" TEXT NOT NULL,
    "page_number" INTEGER NOT NULL,
    "page_url" TEXT,
    "chapter_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "url" TEXT,
    "cover" TEXT,
    "description" TEXT,
    "website" TEXT,
    "discord" TEXT,
    "facebook" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_mangas" (
    "id" TEXT NOT NULL,
    "manga_id" TEXT NOT NULL,
    "scan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scan_mangas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mangas_title_key" ON "mangas"("title");

-- CreateIndex
CREATE UNIQUE INDEX "mangas_slug_key" ON "mangas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_chapter_number_key" ON "chapters"("chapter_number");

-- CreateIndex
CREATE UNIQUE INDEX "scans_name_key" ON "scans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "scans_email_key" ON "scans"("email");

-- CreateIndex
CREATE UNIQUE INDEX "scan_mangas_manga_id_scan_id_key" ON "scan_mangas"("manga_id", "scan_id");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_manga_id_fkey" FOREIGN KEY ("manga_id") REFERENCES "mangas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "scans"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "chapters_pages" ADD CONSTRAINT "chapters_pages_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_mangas" ADD CONSTRAINT "scan_mangas_manga_id_fkey" FOREIGN KEY ("manga_id") REFERENCES "mangas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_mangas" ADD CONSTRAINT "scan_mangas_scan_id_fkey" FOREIGN KEY ("scan_id") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
