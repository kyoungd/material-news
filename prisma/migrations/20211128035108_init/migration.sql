/*
  Warnings:

  - Added the required column `marginable` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" ADD COLUMN     "marginable" BOOLEAN NOT NULL;
