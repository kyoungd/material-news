/*
  Warnings:

  - You are about to drop the column `like_count` on the `site_twitter` table. All the data in the column will be lost.
  - You are about to drop the column `quote_count` on the `site_twitter` table. All the data in the column will be lost.
  - You are about to drop the column `reply_count` on the `site_twitter` table. All the data in the column will be lost.
  - You are about to drop the column `retweet_count` on the `site_twitter` table. All the data in the column will be lost.
  - You are about to drop the column `tweet_id` on the `site_twitter` table. All the data in the column will be lost.
  - Added the required column `link` to the `site_twitter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `site_twitter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "site_twitter" DROP COLUMN "like_count",
DROP COLUMN "quote_count",
DROP COLUMN "reply_count",
DROP COLUMN "retweet_count",
DROP COLUMN "tweet_id",
ADD COLUMN     "link" VARCHAR(1023) NOT NULL,
ADD COLUMN     "title" VARCHAR(511) NOT NULL;
