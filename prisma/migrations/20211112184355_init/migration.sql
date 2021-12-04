/*
  Warnings:

  - A unique constraint covering the columns `[symbol]` on the table `news_symbol` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `site_google` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `site_twitter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `site_yahoo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "news_symbol_symbol_key" ON "news_symbol"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "site_google_symbol_key" ON "site_google"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "site_twitter_symbol_key" ON "site_twitter"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "site_yahoo_symbol_key" ON "site_yahoo"("symbol");
