-- CreateTable
CREATE TABLE "news_symbols" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(15) NOT NULL,
    "pub_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_symbols_pkey" PRIMARY KEY ("id")
);
