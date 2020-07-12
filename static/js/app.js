// Changing container style first
var vcont = d3.select(".container");
vcont.classed("container", false);
vcont.classed("container-fluid", true);

// Remove onchange attribute to fix console error

function getColor() {
  var newColor = '#'+Math.floor(Math.random()*16777215).toString(16);
  return (newColor);
}

function showFunnel(inputSector) {
  var url5 = "top_performer5/10/"+inputSector
  d3.json(url5).then(function(symbolPerfData) {
    // console.log(symbolPerfData);
    sperf = []
    symbol = []
    rcolor = []
    symbolPerfData.forEach(function(id) {
      sperf.push(id.cagr)
      symbol.push(id.symbol)
      rcolor.push(getColor())
    });
    // console.log(rcolor);

    // Plot Preparation for Plotly Funnel Chart
    var data = [{
      type: 'funnel',
      y: symbol,
      x: sperf,
      textposition: "inside",
      textinfo: "value",
      // hoverinfo: 'percent total+x',
      opacity: 0.65, 
      marker: { color: rcolor,
                // line: {"width": [4, 2, 2, 3, 1, 1], 
                //         color: ["3E4E88", "606470", "3E4E88", "606470", "3E4E88"]
                //       }
              },
      connector: {line: {color: "royalblue", dash: "dot", width: 3}}
    }];
    var title = "Top 5 Stocks Performance for "+inputSector
    var layout = {
      title: {'text': title,
              'color': '#0c3e57',
              'xanchor': 'center'
              },
      font: {
        family: 'Helvetica, Arial, sans-serif',
        size: '12',
        // weight: '900',
        weight: 'bold',
        fill: '#0c3e57'
      },
      showlegend: false,
      width: 600, 
      height: 500,
      margin: {t: 40}
    }

    // Setting responsive to the window size
    var config = {
      responsive: true,
      modeBarButtonsToRemove: ['toImage']
    }

    Plotly.newPlot("funnel", data, layout, {displayModeBar: false});
    // Plotly.newPlot("funnel", data, layout);
    // Plotly.newPlot("funnel", data, layout, config);
    // CHECK LATER RESTYLE METHOD.............*************
  });
}

function showHbar() {
  var url4 = "/sector_performance/10"
  d3.json(url4).then(function(sperfData) {
    // console.log(sperfData);
    perf = []
    sectors = []
    sperfData.forEach(function(id) {
      perf.push(id.cagr)
      sectors.push(id.gics_sector)
    });

    // Plot Preparation for Apex Charts
    var options = {
      title: {
        text: "10-Year Sector Average Performance",
        align: 'center',
        style: {color: '#0c3e57'}
      },
      series: [{
        name: "Performance",
        data: perf
    }],
    chart: {
      animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
              enabled: true,
              delay: 350
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
      }
  },
    colors: [function({value}) {
      if (value > 0) {return '#079bb8'}
      else {return '#c9472a'}
    }]
  ,
      chart: {
      type: 'bar',
      height: 450
    },
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: sectors,
    }
    };
  
    var chart = new ApexCharts(document.querySelector("#hbar"), options);
    chart.render();

  });

};

showHbar();

// function to plot candlestick chart
function showCandleStick(symbol) {
  // console.log("Candle Symbol :", symbol);
  url3 = "/daily_data/"+symbol
  // console.log("URL-3", url3);
  d3.json(url3).then(function(dailyData) {
    // console.log("plot data:", dailyData);
    // console.log("single", dailyData[0].stock_date);
    dt = []
    close = []
    high = []
    low = []
    open = []
    volume = []
    dailyData.forEach(function(id) {
      dt.push(new Date(id.stock_date));
      close.push(id.close);
      high.push(id.high);
      low.push(id.low);
      open.push(id.open);
    });
 
    // Plot preparation plotly D3.js-based candlestick charts
    var trace1 = {
      x: dt,
      volume: volume,
      close: close,
      high: high,
      low: low,
      open: open,

      // cutomise colors
      increasing: {line: {color: 'green'}},
      decreasing: {line: {color: 'red'}},

      type: 'candlestick',
      xaxis: 'x',
      yaxis: 'y'
    };

    // var title = 'Date [Stock-'+symbol+']'
    var layout = {
      dragmode: 'zoom',
      title: {'text': symbol,
              'color': '#0c3e57',
              },
      showlegend: false,
      height: 600,
      xaxis: {
        autorange: true,
        title: 'Date',
       rangeselector: {
            x: 0,
            y: 1.2,
            xanchor: 'left',
            font: {size:8},
            buttons: [{
                step: 'month',
                stepmode: 'backward',
                count: 1,
                label: '1 month'
            }, {
                step: 'month',
                stepmode: 'backward',
                count: 6,
                label: '6 months'
            }, {
              step: 'month',
              stepmode: 'backward',
              count: 12,
              label: '1 year'
          },{
              step: 'month',
              stepmode: 'backward',
              count: 60,
              label: '5 years'
          },{
                step: 'all',
                label: '10 years'
            }]
          }
      },
      yaxis: {
        autorange: true,
      }
    };
    // Create a data array
    var candleData = [trace1];

    // Setting responsive to the window size
    var config = {responsive: true}

    // Render the plot
    Plotly.newPlot("candle", candleData, layout, config, {displayModeBar: false});

  });
};

// Update stock symbol profile
function updateProfile(newSymbol) {
  var pbody = d3.select(".panel-body");
  Object.entries(newSymbol[0]).forEach(([key, value]) => {
    var para = pbody.append("small");
    para.text(`${key}: ${value}`);
    para.append("br");
    // console.log(`Update Profile : ${key}: ${value}`);
  });
}

// Read Json file using D3                  Main Section Starts here...
// 
url = "/sector"
d3.json(url).then(function(sectorData) {

  // Extract distinct investment sectors
  // console.log(sectorData);

  var sectors = sectorData;

  // Part-1 :  Generating dropdown 

  // Append stock sector using d3
  var sectorSelect = d3.select("#selSector");
  sectors.forEach(function(id) {
    var option = sectorSelect.append("option");
    option.text(id);
  });

  url2 = "/sector_symbol"
  d3.json(url2).then(function(symsolData) {

    var allSymbols = symsolData;
    // console.log("Symbol unfiltered values for first row", allSymbols[0]);
      
    function showSymbol(inputSector) {
      // console.log("current sector:", inputSector);

      // Filter data record 
      var filterdSymbol = allSymbols.filter(data => data.gics_sector == inputSector);
      // console.log("Filtered Rows:", filterdSymbol);

      // Append stock symbol 
      var symbolSelect = d3.select("#selSymbol");
      filterdSymbol.forEach(function(id) {
        var option = symbolSelect.append("option");
        option.text(id.symbol);
      });
      
      // Extract Symbol profile 
      var pbody = d3.select(".panel-body");
      Object.entries(filterdSymbol[0]).forEach(([key, value]) => {
        var para = pbody.append("small");
        para.text(`${key}: ${value}`);
        para.append("br");
        // console.log(`${key}: ${value}`);
      });

      // console.log("Before calling plot");
      showCandleStick(filterdSymbol[0].symbol);

      symbolSelect.on("change", function() {
        var symbolVal = symbolSelect.property("value");
        // console.log("Selected Symbol:", symbolVal);
        var newProfile = allSymbols.filter(data => data.symbol == symbolVal);
        // console.log("newProfile:",newProfile);
        d3.select(".panel-body").selectAll("small").remove();
        d3.event.preventDefault();
        updateProfile(newProfile);
        showCandleStick(symbolVal);
      });

    };

    showSymbol(sectors[0]);
    showFunnel(sectors[0]);

    sectorSelect.on("change", function() {
    var sectorVal = sectorSelect.property("value");
    // console.log("Selected Sector : ", sectorVal);
    d3.select("#selSymbol").selectAll("option").remove();
    d3.select(".panel-body").selectAll("small").remove();
    // prevent page from refreshing
    d3.event.preventDefault();
    showSymbol(sectorVal);
    showFunnel(sectorVal);
    });

  });

});



