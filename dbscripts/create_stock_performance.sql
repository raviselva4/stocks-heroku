drop table if exists stock_performance;
create table stock_performance as
select * from perf_year1
union
select * from perf_year2
union
select * from perf_year3
union
select * from perf_year4
union
select * from perf_year5
union
select * from perf_year6
union
select * from perf_year7
union
select * from perf_year8
union
select * from perf_year9
union
select * from perf_year10
order by 2,1;

