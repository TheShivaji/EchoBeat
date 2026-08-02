/*
  Warnings:

  - You are about to drop the column `artist` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `artist` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "artist";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "artist";

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArtistAlbums" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArtistAlbums_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArtistSongs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArtistSongs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");

-- CreateIndex
CREATE INDEX "_ArtistAlbums_B_index" ON "_ArtistAlbums"("B");

-- CreateIndex
CREATE INDEX "_ArtistSongs_B_index" ON "_ArtistSongs"("B");

-- AddForeignKey
ALTER TABLE "_ArtistAlbums" ADD CONSTRAINT "_ArtistAlbums_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistAlbums" ADD CONSTRAINT "_ArtistAlbums_B_fkey" FOREIGN KEY ("B") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistSongs" ADD CONSTRAINT "_ArtistSongs_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistSongs" ADD CONSTRAINT "_ArtistSongs_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
