-- CreateTable
CREATE TABLE "site_yahoo" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "pub_date" TIMESTAMP NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "sentiment" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_yahoo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_google" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "pub_date" TIMESTAMP NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "sentiment" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_google_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_twiter" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "pub_date" TIMESTAMP NOT NULL,
    "sentiment" DOUBLE PRECISION NOT NULL,
    "tweet_id" VARCHAR(255) NOT NULL,
    "retweet_count" INTEGER NOT NULL,
    "reply_count" INTEGER NOT NULL,
    "like_count" INTEGER NOT NULL,
    "quote_count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_twiter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_yahoo_pub_date_key" ON "site_yahoo"("pub_date");

-- CreateIndex
CREATE UNIQUE INDEX "site_google_pub_date_key" ON "site_google"("pub_date");

-- CreateIndex
CREATE UNIQUE INDEX "site_twiter_pub_date_key" ON "site_twiter"("pub_date");
