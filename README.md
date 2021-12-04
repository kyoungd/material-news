## REDIS-TIMESERIES local version

$ redis-server --loadmodule /home/young/Desktop/code/RedisTimeSeries/bin/redistimeseries.so

## REDIS client

$ redis-cli

# PRISMA INSTALLATION

## Install prisma package through npm

npm install prisma --save-dev

## Primsa cli initialize project

npx prisma init

## push changese to database (migration)

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgres/

npx prisma migrate dev --name init

## introspection (generate model from database)

https://www.prisma.io/docs/concepts/components/introspection
npx prisma generate

## prisma client (it will perform migration at this time)

npm install @prisma/client

## access database through prisma

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgres/

## APPLICATION DEPLOYEMENT ------------------------------------------------------------------------------------------------------------

# CALL

http://localhost:3003/sentiment-score?symbols=AAPL,FB,GOOG

# (background application that runs continuously)

node search-news.js

# (API running on 3001. check http://localhost:3001/live/ping to see it is active)

npm start

## DESIGN

DB - Table

news_symbols
A list of symbols where their news should be monitored.

site_google
site_twitter
site_yahoo
news entry for google, twitter, and yahoo fiance, and last time it was searched.

---

material-twitter
material-finbert
material-news

# google finance news

https://github.com/pilwon/node-google-finance

# yahoo finance

https://www.npmjs.com/package/yahoo-finance

# test symbols

INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('AGFY', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('MSFT', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('GBIO', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('CNTG', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('LINC', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('VRAR', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('NN', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('VITL', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('GLUE', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('LTBR', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('ORIC', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('TRMR', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('BCTX', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('BIRD', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('DVAX', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('SCPL', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('HTOO', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
INSERT INTO public.news_symbol(symbol, pub_date, last_update)
VALUES ('PVBC', '2021-11-27 08:00:00', '2021-11-27 08:00:00');
