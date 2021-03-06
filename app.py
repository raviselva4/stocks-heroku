#################################################
# Dependencies and setup
#################################################
import pandas as pd
import requests
import time
import warnings
import logging
import sqlalchemy
import os
import psycopg2
from datetime import datetime
from dateutil.relativedelta import relativedelta
from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine, MetaData, text, event
warnings.filterwarnings('ignore')
from pprint import pprint
# from config import *
from config import stock_api_key,db_pass,db_host,db_port,db_name
logger = logging.Logger('catch_all')
# import subprocess

# Flask Setup
app = Flask(__name__)

# Stock data url connection requirements
url = "https://www.alphavantage.co/query?"
function = "function=TIME_SERIES_DAILY"
output="&outputsize=full"
key = f"&apikey={stock_api_key}"

# I believe there is no need to configure app.config because this application is 
# using only create_engine to connect the database....

# PostgreSQL connection based on env setting
ENV = "qa"
if ENV == "development":
    print("Connecting to local database....")
    app.debug = True
    connect_str = 'postgresql://postgres:'+db_pass+'@'+db_host+':'+db_port+'/'+db_name
    # app.config['SQLALCHEMY_DATABASE_URI'] = connect_str
else:
    print("Connecting to heroku database....")
    app.debug = False
    connect_str = os.environ.get('DATABASE_URL', '')
    # print(f"Connect String {connect_str}")
    # dbopen = subprocess.Popen('heroku config:get DATABASE_URL -a stocksinvestmentsandroi', stdout=subprocess.PIPE)
    # connect_str = dbopen.stdoout.read().decode('utf-8').strip() + '?sslmode=require'
    # app.config['SQLALCHEMY_DATABASE_URI'] = connect_str
# Remove tracking modifications
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# engine = create_engine(connect_str, isolation_level="AUTOCOMMIT")
# engine = create_engine(connect_str, fast_executemany=True)
engine = create_engine(connect_str, use_batch_mode=True)
# optimization
# @event.listens_for(engine, 'before_cursor_execute')
# def receive_before_cursor_execute(conn, cursor, statement, params, context, executemany):
#     if executemany:
#         cursor.fast_executemany = True
#         cursor.commit()

connection = engine.connect()

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    print("Server received request for 'Home' page...")
    return render_template("index.html")

# To call prediction page
@app.route("/prediction")
def prediction():
    print("Server received request for 'Prediction' page...")
    return render_template("prediction.html")

# To webscrape sp500 stocks and push it to the postgres database
@app.route("/sp500")
def sp500():
    print("Server received request for 'sp500' data collection page...")
    surl = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    tables = pd.read_html(surl)
    print("Completed web scraping...")
    df = tables[0]
    df.columns= ['symbol', 'security', 'SEC_filings', 'gics_sector', 'gics_sub_industry','headquarters_location', 'date_first_added', 'cik', 'founded']
    del df['SEC_filings']
    df['symbol'] = df['symbol'].replace({'BF.B':'BFB'})
    data_type = {"symbol": sqlalchemy.types.VARCHAR(length=10), 
             "security": sqlalchemy.types.VARCHAR(),
             "gics_sector": sqlalchemy.types.VARCHAR(),
             "gics_sub_industry": sqlalchemy.types.VARCHAR(),
             "headquarters_location	": sqlalchemy.types.VARCHAR(),
             # "date_first_added": sqlalchemy.types.DateTime(),
             "date_first_added": sqlalchemy.types.VARCHAR(length=50),
             "cik": sqlalchemy.types.Integer(),
             "founded": sqlalchemy.types.VARCHAR(length=50)
            }
    print("Before pushing into postgres database......")
    df.to_sql(name="sp500", con=engine, if_exists='replace', index=False, dtype=data_type)
    count = pd.read_sql("select count(*) from sp500", connection)
    return (
        f"Records Pushed to Postgres database...<br/>"
        )
# To get daily stock data from alphavantage website using API and push it to postgres database
# Run this after /sp500 route
@app.route("/getstock_data")
def stockdata():
    print("Server received request for 'getstock_data' data collection page...")
    # This is not required for keroku postgres db as we created empty table structure when setting up heroku
    if ENV == "development":
        print("Running create table if not exists only for local database")
        conn = psycopg2.connect(database = db_name, user = "postgres", password=db_pass, host=db_host, port=db_port)
        command = (
        """
        create table if not exists stock_daily (
            stock_date  timestamp,
            open double precision,
            high double precision,
            low double precision,
            close double precision,
            volume bigint,
            stock_symbol varchar(10)
        )
        """
        )
        cur = conn.cursor()
        cur.execute(command)
        conn.commit()
    print("Finding new stock symbol to be imported using API call")
    new_symbol = pd.read_sql("select distinct symbol from sp500 where not exists (select 1 from stock_daily where stock_symbol = symbol)", connection)
    # up to 5 API requests per minute and 500 requests per day
    err_cnt = 0
    rec_cnt = 0
    tot_cnt = 0
    err_symbol = []
    start_time = time.time()
    etime = time.time() + 60
    for index, row in new_symbol.iterrows():
        rec_cnt += 1
        print(index, row['symbol'], rec_cnt)
        try:
            print(f"Retrieving Stock data from Alphavantage website for the symbol {row['symbol']}")
            symbol = "&symbol="+row['symbol']
            query_url = url+function+key+symbol+output
            # print(query_url)
            response = requests.get(query_url).json()
            time.sleep(13)
            print("Request completed, converting to dataframe")
            result_dict=response["Time Series (Daily)"]
            results_df=pd.DataFrame(result_dict)
            results_df2 = results_df.transpose()
            results_df2["company"] = row['symbol']
            results_df2.reset_index(inplace=True)
            results_df2.columns=['stock_date', 'open', 'high', 'low', 'close', 'volume','stock_symbol']
            results_df2['stock_date'] = pd.to_datetime(results_df2['stock_date'], format='%Y-%m-%d')
            if ENV == "development":
                print("No filter for local db")
                results_df3 = results_df2
            else:
                # filtering only past 10 years of data just to reduce Heroku data load time
                print("Filtering only 10 years of data for Heroku db")
                results_df3 = results_df2[results_df2['stock_date'] > results_df2['stock_date'].max()+relativedelta(years=-10)]
            stock_type = {"stock_date": sqlalchemy.DateTime(), 
                "open": sqlalchemy.types.Float(precision=5, asdecimal=True), 
                "high": sqlalchemy.types.Float(precision=5, asdecimal=True), 
                "low": sqlalchemy.types.Float(precision=5, asdecimal=True),
                "close": sqlalchemy.types.Float(precision=5, asdecimal=True),
                "volume": sqlalchemy.types.BigInteger(),
                "stock_symbol": sqlalchemy.types.VARCHAR(length=10),
                }
            dcnt = results_df3['open'].count()
            if dcnt > 0:
                print(f"Dataframe completed for new symbol, and now pushing symbol {row['symbol']} [{dcnt} rows] to the database")
                print(datetime.now().strftime("%m/%d/%Y %H:%M:%S"))
                results_df3.to_sql(name="stock_daily", con=engine, if_exists='append', index=False, dtype=stock_type)
                print("Records pushed to the database and going to process next stock symbol...")
                print(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        except Exception as e:
            logger.error('Failed Symbol:'+ row['symbol'] + ' Error Info.: ' + str(e))
            err_symbol.append(row['symbol'])
            err_cnt += 1
        print(time.time()-start_time)
        print(etime-time.time())
        sleep_sec = etime-time.time()
        if rec_cnt == 5:
            rec_cnt = 0
            if sleep_sec > 0:
                print(f"API 5 calls/minute limit reached...  sleeping for {sleep_sec} seconds")
                time.sleep(sleep_sec)
                etime = time.time() + 60
        if index > 498:
            tot_cnt = index+1
            print("Reached maximum limit of 500 rows, existing the for loop...")
            mes="Reached maximum limit of 500 rows, existing the for loop..."
            break

    print("Finding existing stock symbol to be imported using API call and update as of today")
    err_cnt2 = 0
    if tot_cnt < 499:
        # API brings no time in the data field so it's effective to check lessthan 'today'::timestamp...
        upd_symbol = pd.read_sql("select a.symbol,max(b.stock_date) max_date from sp500 a join stock_daily b on b.stock_symbol = a.symbol group by a.symbol having max(b.stock_date) < 'today'::timestamp", connection)
        for index, row in upd_symbol.iterrows():
            rec_cnt += 1
            print(index, row['symbol'], rec_cnt)
            try:
                print(f"Retrieving existing Stock data for update from Alphavantage website for the symbol {row['symbol']}")
                symbol = "&symbol="+row['symbol']
                query_url = url+function+key+symbol+output
                # print(query_url)
                response = requests.get(query_url).json()
                time.sleep(13)
                print("Request completed, converting to dataframe")
                result_dict=response["Time Series (Daily)"]
                results_df=pd.DataFrame(result_dict)
                results_df2 = results_df.transpose()
                results_df2["company"] = row['symbol']
                results_df2.reset_index(inplace=True)
                results_df2.columns=['stock_date', 'open', 'high', 'low', 'close', 'volume','stock_symbol']
                results_df2['stock_date'] = pd.to_datetime(results_df2['stock_date'], format='%Y-%m-%d')
                # filtering by max date
                results_df3 = results_df2[results_df2['stock_date'] > row['max_date']]
                stock_type = {"stock_date": sqlalchemy.DateTime(), 
                    "open": sqlalchemy.types.Float(precision=5, asdecimal=True), 
                    "high": sqlalchemy.types.Float(precision=5, asdecimal=True), 
                    "low": sqlalchemy.types.Float(precision=5, asdecimal=True),
                    "close": sqlalchemy.types.Float(precision=5, asdecimal=True),
                    "volume": sqlalchemy.types.BigInteger(),
                    "stock_symbol": sqlalchemy.types.VARCHAR(length=10),
                    }
                dcnt = results_df3['open'].count()
                if dcnt > 0:
                    print(f"Dataframe completed for update symbol, and now pushing symbol {row['symbol']} [{dcnt} rows] to the database")
                    print(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
                    results_df3.to_sql(name="stock_daily", con=engine, if_exists='append', index=False, dtype=stock_type)
                    print(datetime.now().strftime("%m/%d/%Y %H:%M:%S"))
                    print("Records pushed to the database and going to process next update stock symbol...")
                else:
                    print(f"No records found after filtering. Skipping symbol {row['symbol']}...")
            except Exception as e:
                logger.error('Failed Symbol:'+ row['symbol'] + ' Error Info.: ' + str(e))
                err_symbol.append(row['symbol'])
                err_cnt2 += 1
            print(time.time()-start_time)
            print(etime-time.time())
            sleep_sec = etime-time.time()
            if rec_cnt == 5:
                rec_cnt = 0
                if sleep_sec > 0:
                    print(f"API 5 calls/minute limit reached...  sleeping for {sleep_sec} seconds")
                    time.sleep(sleep_sec)
                    etime = time.time() + 60
            if (tot_cnt+index) > 498:
                tot_cnt += index+1
                print("Reached maximum limit of 500 rows, existing the for loop...")
                mes="Reached maximum limit of 500 rows, existing the for loop..."
                break
    print(" ")
    print(f"End of processing {tot_cnt} records in {round((time.time()-start_time)/60,4)} minutes!!! ")
    print(f"There are {err_cnt} records ends with error for new symbols and {err_cnt2} records ends with error on update symbols")
    print(" ")
    
    return (
        f" <br/>"
        f"End of processing {tot_cnt} records in {round((time.time()-start_time)/60,4)} minutes!!! "
        f" <br/>"
        f"No. of records ends with error: {err_cnt} for new symbol download and {err_cnt2} records for update symbols "
        f" <br/>"
        f"Here are the list of symbol(s) ends with error: {err_symbol}  <br/>"
        f" <br/>"
        f"{mes}"
        f" <br/>"
        f"If you see any errors like 'Expecting value: line 1 column 1 (char 0)' then you may rerun the same route after some time until you get no errors.  <br/>"
    )

# To create base views for stock_performance table  
# to be run after /getstock_data route
@app.route("/create_views")
def views():
    print("Server received request for 'Create views' page...")
    sfile = open('dbscripts/create_perf_views.sql')
    dbscript = sqlalchemy.text(sfile.read())
    engine.execute(dbscript)
    # connection.execute(text("dbscripts/create_perf_views.sql")).execution_options(autocommit=True)
    # import urllib.parse as urlparse
    # hurl = urlparse.urlparse(os.environ['DATABASE_URL'])
    # hdbname = url.path[1:]
    # huser = url.username
    # hpassword = url.password
    # hhost = url.hostname
    # hport = url.port

    # hcon = psycopg2.connect(
    #             dbname=hdbname,
    #             user=huser,
    #             password=hpassword,
    #             host=hhost,
    #             port=hport
    #             )
    # with self.hcon as cursor:
    #     cursor.executescript(open("dbscripts/create_perf_views.sql", "r").read())
    # with open('dbscripts/create_perf_views.sql') as script:
    #     cursor.execute(script.read().decode('utf-8'), multi=True)
    return(
        f"<br/>"
        f"DB views created..."
        f"<br/>"
    )
# To create stock_performace table 
# Run after /create_views route
@app.route("/create_stock_performance")
def basetable():
    print("Server received request for 'Create stock performance table' page...")
    sfile = open('dbscripts/create_stock_performance.sql')
    dbscript = sqlalchemy.text(sfile.read())
    engine.execute(dbscript)
    return(
        f"<br/>"
        f"stock_performance table created..."
        f"<br/>"
    )

# To delete all stock daily data if case of complete maintenance or api structure change
@app.route("/delete_stockdata")
def delete_stockdata():
    print("Server received request for 'Delete stock data' page...")
    engine.execute(text("truncate table stock_daily").execution_options(autocommit=True))
    return(
        f"<br/>"
        f"stock_daily table data deleted..."
        f"<br/>"
    )

# To pull all sectors from postgres database
@app.route("/sector")
def sector():
    print("Server received request for 'sector' page...")
    sector = []
    srow_set = engine.execute("select distinct gics_sector from sp500 order by gics_sector")
    for srows in srow_set:
        sector.append(srows['gics_sector'])
    return jsonify(sector)

#  To pull all symbols from postgres database
@app.route("/sector_symbol")
def sector_symbol():
    print("Server received request for 'sector_symbol' page...")
    vsymbol = pd.read_sql("select gics_sector,symbol,security,gics_sub_industry,headquarters_location,  \
                            date_first_added,cik,founded from sp500 order by gics_sector,symbol", connection)
    rsymbol = vsymbol.to_json(orient='records', lines=False)
    return (rsymbol)
    #     symbol_json = engine.execute("select array_to_json(array_agg(row_to_json(t)))  \
    #                                     from (  \
    #                                         select gics_sector,symbol   \
    #                                         from sp500  \
    #                                         order by gics_sector,symbol \
    #                                         ) t ")
    #     return jsonify(symbol_json)

#  To pull all daily data from postgres database
@app.route("/daily_data/<vsymbol>")
def daily_data(vsymbol):
    print("Server received request for 'daily_data' page...")
    sql_stat = """select stock_date,open,high,low,close,volume,stock_symbol from stock_daily
                where stock_date between now()-interval '10 years' and now() and stock_symbol = %s"""
    sdaily = pd.read_sql(sql_stat, connection, params=(vsymbol,))
    rsdaily = sdaily.to_json(orient='records', lines=False)
    return (rsdaily)

#  To pull sector performance based on year input from postgres database
@app.route("/sector_performance/<year>")
def sector_performace(year):
    print("Server received request for 'sector_performance' page...")
    sql_stat = """select a.gics_sector, round(avg(b.cagr),2) cagr
                from sp500 a, stock_performance b
                where b.stock_symbol = a.symbol
                  and b.year = %s
                group by gics_sector
                order by avg(cagr) desc"""
    sectorPerf = pd.read_sql(sql_stat, connection, params=(year,))
    result = sectorPerf.to_json(orient='records', lines=False)
    return(result)

# To pull all data from stock_performance from postgres database  
@app.route("/stock_performance")
def stock_performace():
    print("Server received request for 'stock_performance' page...")
    sql_stat = """select a.gics_sector, a.security, a.symbol, b.year, b.close, b.cagr
                from sp500 a, stock_performance b
                where b.stock_symbol = a.symbol 
                order by year"""
    symbolPerf = pd.read_sql(sql_stat, connection)
    # params=({"year":year,"sector": sector},)
    result = symbolPerf.to_json(orient='records', lines=False)
    return(result)

# To pull symbol prediction with security input from postgres database
# @app.route("/security_prediction/<year>/<security>")
@app.route("/symbol_prediction/<security>")
def symbol_prediction(security):
    print("Server received request for 'symbol_performance' page...")
    sql_stat = """select a.gics_sector, a.symbol, b.cagr cagr
                from sp500 a, stock_performance b
                where b.stock_symbol = a.symbol
                and b.year = 10
                and a.symbol = %s
                order by cagr desc"""
    symbolPerf = pd.read_sql(sql_stat, connection, params=(security,))
    # params=({"year":year,"sector": sector},)
    result = symbolPerf.to_json(orient='records', lines=False)
    return(result)

# To pull all security performance from postgres database
@app.route("/allsecurity_performance")
def allsecurity_performance():
    print("Server received request for 'symbol_performance' page...")
    sql_stat = """select a.gics_sector, a.security, a.symbol, b.close, b.cagr
                from sp500 a, stock_performance b
                where b.stock_symbol = a.symbol
                and b.year = 10
                order by cagr desc"""
    symbolPerf = pd.read_sql(sql_stat, connection)
    # params=({"year":year,"sector": sector},)
    result = symbolPerf.to_json(orient='records', lines=False)
    return(result)

# To pull all top 5 performers from postgres database based on sector
@app.route("/top_performer5/<year>/<sector>")
def top_performer5(year,sector):
    print("Server received request for 'symbol_performance' page...")
    sql_stat = """select a.gics_sector, a.symbol, b.cagr
                from sp500 a, stock_performance b
                where b.stock_symbol = a.symbol
                and b.year = %s
                and a.gics_sector = %s
                order by cagr desc
                limit 5"""
    symbolPerf = pd.read_sql(sql_stat, connection, params=(year, sector,))
    # params=({"year":year,"sector": sector},)
    result = symbolPerf.to_json(orient='records', lines=False)
    return(result)

#
if __name__ == "__main__":
    app.run()
