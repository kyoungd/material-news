/*
  Warnings:

  - You are about to drop the `site_twiter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "site_twiter";

-- CreateTable
CREATE TABLE "site_twitter" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(15) NOT NULL,
    "description" TEXT NOT NULL,
    "pub_date" TIMESTAMP(3) NOT NULL,
    "sentiment" DOUBLE PRECISION NOT NULL,
    "tweet_id" VARCHAR(255) NOT NULL,
    "retweet_count" INTEGER NOT NULL,
    "reply_count" INTEGER NOT NULL,
    "like_count" INTEGER NOT NULL,
    "quote_count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_twitter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_twitter_pub_date_key" ON "site_twitter"("pub_date");
