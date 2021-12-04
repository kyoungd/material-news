-- CreateTable
CREATE TABLE "company" (
    "stock" VARCHAR(15) NOT NULL,
    "name" VARCHAR(511) NOT NULL,
    "search_term" VARCHAR(511) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("stock")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_stock_key" ON "company"("stock");

-- AddForeignKey
ALTER TABLE "news_symbol" ADD CONSTRAINT "news_symbol_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "company"("stock") ON DELETE RESTRICT ON UPDATE CASCADE;
