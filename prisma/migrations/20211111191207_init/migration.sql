/*
  Warnings:

  - You are about to drop the `news_symbols` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "news_symbols";

-- CreateTable
CREATE TABLE "news_symbol" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(15) NOT NULL,
    "pub_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_symbol_pkey" PRIMARY KEY ("id")
);
