function dateChart(dataForCurb, events) {
 
  var dataPoints1 = [];
  var stockChart = new CanvasJS.StockChart("chartContainer", {
    
    title: {
        text: "Curb Prediction Data",
        fontFamily: "helvetica"
    },
    subtitles: [{
        text: "Click on navigator to update the range",
        fontFamily: "helvetica"
    }],
    charts: [{
        axisX: {
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            prefix: ""
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "line",
            name: "Prediction Data",
            yValueFormatString: "#,###.##",
            dataPoints: dataPoints1
        }]
    }],
    rangeSelector: {
        inputFields: {
            startValue: new Date(2025, 2, 1),
            endValue: new Date(2025, 4, 1)
        }
    },
    navigator: {
        data: [{
          dataPoints: dataPoints1
        }]
    }
});

    // need to add event bus here, and deliever curb id 
    events.addEventListener('filter-curb', (evt) => {

      
      const filteredCurbsGrp = evt.detail.filteredCurbs;
      //console.log('Filtered curbsbgrp:', filteredCurbsGrp);
      const filteredCurbs = filteredCurbsGrp.length > 0 ? filteredCurbsGrp[0] : null;
      if (filteredCurbs) {
        const targetCurbId = filteredCurbs.properties.curb_id;
        const filteredData = dataForCurb.filter(data => data.curb_id === targetCurbId);
        console.log('Filtered Data:', filteredData);
        const uniqueByDateData = filteredData.reduce((acc, currentItem) => {
          if (!acc.datesSeen[currentItem.date]) { // Check if the date has not been seen before
              acc.datesSeen[currentItem.date] = true; // Mark this date as seen
              acc.uniqueData.push(currentItem); // Add the current item to the result array
          }
          return acc;
      }, { datesSeen: {}, uniqueData: [] }).uniqueData;
      console.log('Unique Data:', uniqueByDateData);
      console.log('stockChart:', stockChart);
    

    uniqueByDateData.sort((a,b)=>{
      return new Date(b.date) - new Date(a.date);
  })
    console.log('Unique Data after sort:', uniqueByDateData);
    // Assuming dataForCurb is already filtered and unique by date

    uniqueByDateData.forEach(function(item) {
        dataPoints1.push({
            x: new Date(item.date),
            y: Number(item.Prediction)  // Assuming 'Prediction' is the key for the data
        });
    });

    // Update the stock chart with new data
    //stockChart.options.charts[0].data[0].dataPoints = dataPoints1;
    //stockChart.navigator.data[0].dataPoints = dataPoints1; // Assuming you want the same data in the navigator
    stockChart.render();
    }
      
  });
};




export {
    dateChart,
  };