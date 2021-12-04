/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `site_google` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[link]` on the table `site_twitter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[link]` on the table `site_yahoo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "site_google_pub_date_key";

-- DropIndex
DROP INDEX "site_twitter_pub_date_key";

-- DropIndex
DROP INDEX "site_yahoo_pub_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "site_google_link_key" ON "site_google"("link");

-- CreateIndex
CREATE UNIQUE INDEX "site_twitter_link_key" ON "site_twitter"("link");

-- CreateIndex
CREATE UNIQUE INDEX "site_yahoo_link_key" ON "site_yahoo"("link");
