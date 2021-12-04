/*
  Warnings:

  - You are about to alter the column `symbol` on the `site_google` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(15)`.
  - You are about to alter the column `symbol` on the `site_twiter` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(15)`.
  - You are about to alter the column `symbol` on the `site_yahoo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE "site_google" ALTER COLUMN "symbol" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(511),
ALTER COLUMN "link" SET DATA TYPE VARCHAR(1023);

-- AlterTable
ALTER TABLE "site_twiter" ALTER COLUMN "symbol" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "site_yahoo" ALTER COLUMN "symbol" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(511),
ALTER COLUMN "link" SET DATA TYPE VARCHAR(1023);
