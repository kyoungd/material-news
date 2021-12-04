/*
  Warnings:

  - The primary key for the `company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stock` on the `company` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(511)` to `VarChar(255)`.
  - A unique constraint covering the columns `[id]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `easy_to_borrow` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exchange` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fractionable` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortable` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradable` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "news_symbol" DROP CONSTRAINT "news_symbol_symbol_fkey";

-- DropIndex
DROP INDEX "company_stock_key";

-- AlterTable
ALTER TABLE "company" DROP CONSTRAINT "company_pkey",
DROP COLUMN "stock",
ADD COLUMN     "class" VARCHAR(15) NOT NULL,
ADD COLUMN     "easy_to_borrow" BOOLEAN NOT NULL,
ADD COLUMN     "exchange" VARCHAR(15) NOT NULL,
ADD COLUMN     "fractionable" BOOLEAN NOT NULL,
ADD COLUMN     "id" VARCHAR(39) NOT NULL,
ADD COLUMN     "shortable" BOOLEAN NOT NULL,
ADD COLUMN     "status" VARCHAR(15) NOT NULL,
ADD COLUMN     "symbol" VARCHAR(15) NOT NULL,
ADD COLUMN     "tradable" BOOLEAN NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "company_pkey" PRIMARY KEY ("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "company_id_key" ON "company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "company_symbol_key" ON "company"("symbol");

-- AddForeignKey
ALTER TABLE "news_symbol" ADD CONSTRAINT "news_symbol_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "company"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
