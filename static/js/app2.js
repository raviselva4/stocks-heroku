
// Read the URL to collect and display the top 20 companies using flask

  url4 = "http://127.0.0.1:5000/allsecurity_performance";
  console.log(url4);
  d3.json(url4).then(function(top20) 
  {
    console.log("Performance", top20);
    var top = top20.slice(0, 20);
    console.log(top);
    
    var selectTop=d3.select("#TOP10");

    top.forEach(function(id) 
    {
     console.log(id);
     var inputstring=id.gics_sector+ '-' + id.security + '-' + '$' + id.close + '-' + id.cagr + '%';
     var li= selectTop.append("li");
     li.text(inputstring);
    });
  });
  
//Read the URL to collect and display the sector information in the industry dropdown

url = "http://127.0.0.1:5000/sector"
console.log(url);
  d3.json(url).then(function(sectorData) 
  {

    // Extract distinct investment sectors
    console.log(sectorData);

    var sectors = sectorData;

    // Part-1 :  Generating dropdown 

    // Append stock sector using d3
    var sectorSelect1 = d3.select("#investments1");
    var sectorSelect2 = d3.select("#investments2");
    var sectorSelect3 = d3.select("#investments3");
    var sectorSelect4 = d3.select("#investments4");
    var sectorSelect5 = d3.select("#investments5");

    var AmountSelect1 = d3.select("#Amount1");
    var AmountSelect2 = d3.select("#Amount2");
    var AmountSelect3 = d3.select("#Amount3");
    var AmountSelect4 = d3.select("#Amount4");
    var AmountSelect5 = d3.select("#Amount5");

    var selectCompany1 = d3.select("#Company1");
    var selectCompany2 = d3.select("#Company2");
    var selectCompany3 = d3.select("#Company3");
    var selectCompany4 = d3.select("#Company4");
    var selectCompany5 = d3.select("#Company5");

    // sectors.forEach(function(id) 
    // {
    // console.log(id)
    // var option = sectorSelect.append("option");
    // option.text(id);
    // });
    showSector(sectorSelect1,AmountSelect1);
    showSector(sectorSelect2,AmountSelect2);
    showSector(sectorSelect3,AmountSelect3);
    showSector(sectorSelect4,AmountSelect4);
    showSector(sectorSelect5,AmountSelect5);

      function showSector(inputSector,Amount)
      {
        sectors.forEach(function(id)
        {
        console.log(id);
        var option = inputSector.append("option");
        option.text(id);
        });    

        var option = Amount.append("option");
        option.text("$500");
        var option = Amount.append("option");
        option.text("$1000");
        var option = Amount.append("option");
        option.text("$1500");
        var option = Amount.append("option");
        option.text("$2000");
        var option = Amount.append("option");
        option.text("$2500");
        var option = Amount.append("option");
        option.text("$5000");
        var option = Amount.append("option");
        option.text("$10000");
        var option = Amount.append("option");
        option.text("$25000");
        var option = Amount.append("option");
        option.text("$50000");
      }
	  
// function to collect and display the comapnies from flask

      function showSymbol(inputSector,Company) 
      {
        url2 = "http://127.0.0.1:5000/sector_symbol"
        console.log(url);
        console.log(inputSector);
        console.log(Company);
        d3.json(url2).then(function(allSymbols) 
        {
            console.log("Symbol unfiltered values for first row", allSymbols[0]);   
            console.log("current sector:", inputSector);

            // Filter data record 
            var filterdSymbol = allSymbols.filter(data => data.gics_sector == inputSector);
            console.log("Filtered Rows:", filterdSymbol);  
            d3.select(Company).selectAll("option").remove();
              // Append stock symbol 
            var symbolSelect = d3.select(Company);
            filterdSymbol.forEach(function(id) 
            {
                  var option = symbolSelect.append("option");
                  option.text(id.security);
              });
          });
      }

      showSymbol(sectorData[0],"#Company1");
      showSymbol(sectorData[0],"#Company2");
      showSymbol(sectorData[0],"#Company3");
      showSymbol(sectorData[0],"#Company4");
      showSymbol(sectorData[0],"#Company5");
 
      sectorSelect1.on("change", function() 
      {
        var sectorVal1 = sectorSelect1.property("value");
        console.log("Selected Sector : ", sectorVal1);
        console.log("ppppppppppppppppppppppppppppppppp");
        //d3.select("#investments1").selectAll("option").remove();
        // prevent page from refreshing
        d3.event.preventDefault();
        showSymbol(sectorVal1,"#Company1");
      });
      
      sectorSelect2.on("change", function() 
      {
        var sectorVal2 = sectorSelect2.property("value");
        console.log("Selected Sector : ", sectorVal2);
        console.log("ppppppppppppppppppppppppppppppppp");
        //d3.select("#investments1").selectAll("option").remove();
        // prevent page from refreshing
        d3.event.preventDefault();
        showSymbol(sectorVal2,"#Company2");
      });

      sectorSelect3.on("change", function() 
      {
        var sectorVal3 = sectorSelect3.property("value");
        console.log("Selected Sector : ", sectorVal3);
        console.log("ppppppppppppppppppppppppppppppppp");
        //d3.select("#investments1").selectAll("option").remove();
        // prevent page from refreshing
        d3.event.preventDefault();
        showSymbol(sectorVal3,"#Company3");
      });

      sectorSelect4.on("change", function() 
      {
        var sectorVal4 = sectorSelect4.property("value");
        console.log("Selected Sector : ", sectorVal4);
        console.log("ppppppppppppppppppppppppppppppppp");
        //d3.select("#investments1").selectAll("option").remove();
        // prevent page from refreshing
        d3.event.preventDefault();
        showSymbol(sectorVal4,"#Company4");
      });

      sectorSelect5.on("change", function() 
      {
        var sectorVal5 = sectorSelect5.property("value");
        console.log("Selected Sector : ", sectorVal5);
        console.log("ppppppppppppppppppppppppppppppppp");
        //d3.select("#investments1").selectAll("option").remove();
        // prevent page from refreshing
        d3.event.preventDefault();
        showSymbol(sectorVal5,"#Company5");
      });

      var yearsSelect = d3.select("#years");
      var option = yearsSelect.append("option");
      option.text("1");
      var option = yearsSelect.append("option");
      option.text("2");
      var option = yearsSelect.append("option");
      option.text("3");
      var option = yearsSelect.append("option");
      option.text("4");
      var option = yearsSelect.append("option");
      option.text("5");
      var option = yearsSelect.append("option");
      option.text("6");
      var option = yearsSelect.append("option");
      option.text("7");
      var option = yearsSelect.append("option");
      option.text("8");
      var option = yearsSelect.append("option");
      option.text("9");
      var option = yearsSelect.append("option");
      option.text("10");
      
// This function is triggered when the button is clicked
 function handleClick() {
  console.log("A button was clicked!");

// We can use d3 to see the object that dispatched the event
  console.log(d3.event.target);
  }

var button = d3.select("#button");
// We can use the `on` function in d3 to attach an event to the handler function
button.on("click", handlefilter);

// function to calculate the return on investment and the bar graph

function handlefilter(event)
{
  var InputSector1= sectorSelect1.property("value");
  var InputSector2= sectorSelect2.property("value");
  var InputSector3= sectorSelect3.property("value");
  var InputSector4= sectorSelect4.property("value");
  var InputSector5= sectorSelect5.property("value");
  var InputAmount1= AmountSelect1.property("value");
  var InputAmount2= AmountSelect2.property("value");
  var InputAmount3= AmountSelect3.property("value");
  var InputAmount4= AmountSelect4.property("value");
  var InputAmount5= AmountSelect5.property("value");
  var InputCompany1= selectCompany1.property("value");
  var InputCompany2= selectCompany2.property("value");
  var InputCompany3= selectCompany3.property("value");
  var InputCompany4= selectCompany4.property("value");
  var InputCompany5= selectCompany5.property("value");
  console.log(InputSector1);
  console.log(InputSector2);
  console.log(InputSector3);
  console.log(InputSector4);
  console.log(InputSector5);
  console.log(InputAmount1);
  console.log(InputAmount2);
  console.log(InputAmount3);
  console.log(InputAmount4);
  console.log(InputAmount5);
  console.log(InputCompany1);
  console.log(InputCompany2);
  console.log(InputCompany3);
  console.log(InputCompany4);
  console.log(InputCompany5);

// Take years as input and calculate the ROI
  InputYears = yearsSelect.property("value");

  url3 = "http://127.0.0.1:5000/allsecurity_performance"
  console.log(url3);
  d3.json(url3).then(function(allperformance) 
        {
            console.log("Performance", allperformance);

            var filterperf1=allperformance.filter(data => data.security == InputCompany1 );
            console.log(filterperf1);
            cagrCompany1 = filterperf1[0].cagr;
            console.log(cagrCompany1);
            var x= (1 + (cagrCompany1/100));
            console.log(x,InputAmount1,InputYears);
            var Matval= Math.pow(x,InputYears);
            console.log(Matval);
            InterAmount1=InputAmount1.replace(/[$,]+/g,"");
            console.log(InterAmount1);
            var NewInputAmount1 = parseFloat(InterAmount1);
            console.log(NewInputAmount1);
            ROICompany1 =  Math.round(NewInputAmount1 * Matval,0);
            console.log (ROICompany1);

            var filterperf2=allperformance.filter(data => data.security == InputCompany2 );
            console.log(filterperf1);
            cagrCompany2 = filterperf2[0].cagr;
            console.log(cagrCompany2);
            var x= (1 + (cagrCompany2/100));
            console.log(x,InputAmount2,InputYears);
            var Matval= Math.pow(x,InputYears);
            console.log(Matval);
            InterAmount2=InputAmount2.replace(/[$,]+/g,"");
            console.log(InterAmount2);
            var NewInputAmount2 = parseFloat(InterAmount2);
            console.log(NewInputAmount2);
            ROICompany2 =  Math.round(NewInputAmount2 * Matval,0);
            console.log (ROICompany2);

            var filterperf3=allperformance.filter(data => data.security == InputCompany3 );
            console.log(filterperf1);
            cagrCompany3 = filterperf3[0].cagr;
            console.log(cagrCompany3);
            var x= (1 + (cagrCompany3/100));
            console.log(x,InputAmount3,InputYears);
            var Matval= Math.pow(x,InputYears);
            console.log(Matval);
            InterAmount3=InputAmount3.replace(/[$,]+/g,"");
            console.log(InterAmount3);
            var NewInputAmount3 = parseFloat(InterAmount3);
            console.log(NewInputAmount3);
            ROICompany3 =  Math.round(NewInputAmount3 * Matval,0);
            console.log (ROICompany3);

            var filterperf4=allperformance.filter(data => data.security == InputCompany4 );
            console.log(filterperf1);
            cagrCompany4 = filterperf4[0].cagr;
            console.log(cagrCompany4);
            var x= (1 + (cagrCompany4/100));
            console.log(x,InputAmount4,InputYears);
            var Matval= Math.pow(x,InputYears);
            console.log(Matval);
            InterAmount4=InputAmount4.replace(/[$,]+/g,"");
            console.log(InterAmount4);
            var NewInputAmount4 = parseFloat(InterAmount4);
            console.log(NewInputAmount4);
            ROICompany4 =  Math.round(NewInputAmount4 * Matval,0);
            console.log (ROICompany4);

            var filterperf5=allperformance.filter(data => data.security == InputCompany5 );
            console.log(filterperf1);
            cagrCompany5 = filterperf5[0].cagr;
            console.log(cagrCompany5);
            var x= (1 + (cagrCompany5/100));
            console.log(x,InputAmount5,InputYears);
            var Matval= Math.pow(x,InputYears);
            console.log(Matval);
            InterAmount5=InputAmount5.replace(/[$,]+/g,"");
            console.log(InterAmount5);
            var NewInputAmount5 = parseFloat(InterAmount5);
            console.log(NewInputAmount5);
            ROICompany5 = Math.round(NewInputAmount5 * Matval,0);
            console.log (ROICompany5);

            var Total_Investment_Profile =NewInputAmount1 + NewInputAmount2 + NewInputAmount3 + NewInputAmount4 + NewInputAmount5;
            var Total_ROI = ROICompany1 + ROICompany2 + ROICompany3 + ROICompany4 + ROICompany5;
            
            d3.select("#portfolio").selectAll("p").remove();
            d3.select("#ROI").selectAll("p").remove();
            var PFAmount = d3.select("#portfolio");
            var ROIAmount = d3.select("#ROI");
            var ppf = PFAmount.append("p");
            var ppfstring= "Total Portfolio Investment: $" + Total_Investment_Profile;
            ppf.text(ppfstring);
            var rif = ROIAmount.append("p");
            var rifstring= "Return on Investment: $" + Total_ROI;
            rif.text(rifstring);

            // ROIAmount.append.text("Return on Investment: $", Total_ROI);

            console.log("Total Investment:",Total_Investment_Profile,"Total ROI:",Total_ROI,"Investment Years:",InputYears);

            var xValue = [InputCompany1,InputCompany2,InputCompany3,InputCompany4,InputCompany5]
            var yValue = [NewInputAmount1, NewInputAmount2, NewInputAmount3, NewInputAmount4,NewInputAmount5];
            var ylabel = ['$'+NewInputAmount1, '$'+NewInputAmount2, '$'+NewInputAmount3, '$'+NewInputAmount4,'$'+NewInputAmount5];
            var yValue2 = [ROICompany1, ROICompany2, ROICompany3,ROICompany4,ROICompany5];
            var ylabel2 = ['$'+ROICompany1, '$'+ROICompany2, '$'+ROICompany3,'$'+ROICompany4,'$'+ROICompany5];
 
// traces and layout to create the bar graph 

// Define trace1 for amounts invested

            var trace1 = {
              x: xValue,
              y: yValue,
              type: 'bar',
              name: 'Investment',
              text: ylabel,
              textposition: 'auto',
              hoverinfo: 'none',
              opacity: 0.5,
              marker: {
                color: 'rgb(158,202,225)',
                line: {
                  color: 'rgb(8,48,107)',
                  width: 1.5
                }
              }
            };
			
// Define trace2 for return on investment

            var trace2 = {
              x: xValue,
              y: yValue2,
              type: 'bar',
              name: 'ROI',
              text: ylabel2,
              textposition: 'auto',
              hoverinfo: 'none',
              marker: {
                color: 'rgba(58,200,225,.5)',
                line: {
                  color: 'rgb(8,48,107)',
                  width: 1.5
                }
              }
            };

            var data = [trace1,trace2];

            console.log(data);

// Define the layout

            var layout = {
              // autosize: false,
              // width: 50,
              // height: 50,
              margin: {
                   l: 50,
              //   r: 50,
                   b: 150,
              //   t: 100,
              //   pad: 4
               },
              // // yaxis: {
              //   // title: 'Y-axis Title',
              //   // ticktext: ['long label','Very long label','3','label'],
              //   // tickvals: [1, 2, 3, 4],
              //   // tickmode: 'array',
              //   // automargin: true,
              //   // titlefont: { size:30 },
              // // },
              title: 'Return on Investment on each Company'
            };

//Display the bargraph

            Plotly.newPlot('bar', data, layout);
          });
    }
});

