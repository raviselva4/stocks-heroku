# Stock_Investments_ROI

URL :  https://stocksinvestmentsandroi.herokuapp.com

### Technical Artifacts Leveraged

1) Python Flask         - app.py
2) Powered RESTful API  - https://www.alphavantage.co/query?
3) HTML                 - index.html, prediction.html
3) CSS                  - style.css
4) JS                   - app.js, app2.js
5) Database             - Postgres
6) Webscraping          - https://en.wikipedia.org/wiki/List_of_S%26P_500_companies
7) D3.js                - app.js, app2.js
8) Plotly               - Timeseris, Bar (vertical/horizantal), Funnel graph
9) Apex Charts          - New JS open source library
10) Menus/dropdowns     - Fulfilled

### Data Volume

For Heroku postgres we restrict only 10 years of Stock daily data (1.3 million rows)
There is no restriction for local postgres database and you can keep 20 years of data (2.25 million rows)

### Visualiztion used

1) Dynamic Funnel Chart, Candel stick View, ROI views
2) Apex chart with Sector Performance

### To get latest data update

1) Run route /sp500                     - to get latest master data
2) Run route /getstock_data             - to get daily stock data
3) Run route /create_views              - base view to create stock_performance table (only required if the table get dropped)
4) Run route /create_stock_performance  - to create stock_performance table
5) Run route /delete_stockdata          - run if required to delete all stock daily data

