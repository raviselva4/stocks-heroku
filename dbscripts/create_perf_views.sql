create or replace view perf_year1 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '1 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 1 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/1.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year2 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '2 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 2 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/2.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year3 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '3 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 3 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/3.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year4 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '4 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 4 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/4.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year5 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '5 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 5 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/5.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year6 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '6 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 6 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/6.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year7 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '7 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 7 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/7.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year8 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '8 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 8 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/8.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year9 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '9 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 9 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/9.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;
create or replace view perf_year10 as
with stk_dates as
(
select stock_symbol, min(stock_date) bdt, max(stock_date) edt
from stock_daily
where stock_date between now()-interval '10 year' and now()
group by stock_symbol
)
, stk_bvalue as
(
select a.stock_symbol, open
from stock_daily a, stk_dates b
where a.stock_date = b.bdt
  and a.stock_symbol = b.stock_symbol
)
, stk_evalue as
(
select a.stock_symbol, close
from stock_daily a, stk_dates b
where a.stock_date = b.edt
  and a.stock_symbol = b.stock_symbol
)
select 10 as year, a.stock_symbol, open, close,
round(cast(((power((close/open), (1/10.0))-1)*100) as numeric),2) as cagr
from stk_bvalue a, stk_evalue b
where a.stock_symbol = b.stock_symbol;