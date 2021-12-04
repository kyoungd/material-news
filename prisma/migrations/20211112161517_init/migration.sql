/*
  Warnings:

  - Added the required column `last_update` to the `news_symbol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "news_symbol" ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL;
