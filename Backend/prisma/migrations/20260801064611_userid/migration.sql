/*
  Warnings:

  - Added the required column `userId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false;
