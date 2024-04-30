function dateChart(dataForCurb, events) {
  window.onload = function () {
    var dataPoints1 = [], dataPoints2 = [] ;
    var stockChart = new CanvasJS.StockChart("chartContainer", {
      title:{
        text:"DatePicker",
        fontFamily: "helvetica"
      },
      subtitles: [{
        text: "Click on inputfields to update the range using datepicker",
        fontFamily: "helvetica"
      }],
      rangeChanged: function(e) {
        if(e.source == "inputFields") {
          hideDatePicker();
        }
      },
      charts: [{
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          prefix: "€"
        },
        toolTip: {
          shared: true
        },
        data: [{
          type: "ohlc",
          name: "Litecoin Price",
          yValueFormatString: "€#,###.##",
          dataPoints : dataPoints1
        }]
      }],
      rangeSelector: {
        inputFields: {
          startValue: new Date(2018, 0o2, 0o1),
          endValue: new Date(2018, 0o4, 0o1)
        }
      },
      navigator: {
        data: [{
          dataPoints: dataPoints2
        }]
      }
    });
    // need to add event bus here, and deliever curb id 
    jQuery.getJSON("https://canvasjs.com/data/docs/ltceur2018.json", function(data) {
      for(var i = 0; i < data.length; i++){
        dataPoints1.push({x: new Date(data[i].date), y: [Number(data[i].open), Number(data[i].high), Number(data[i].low), Number(data[i].close)]});
        dataPoints2.push({x: new Date(data[i].date), y: Number(data[i].close)});
      }
      stockChart.render();
      //add jQuery UI DatePicker to inputFields
      jQuery(".canvasjs-input-field").each(function(index) {
        min = new Date(dataPoints2[0].x);
        max = new Date(dataPoints2[dataPoints2.length-1].x);
        jQuery(this).datepicker({
          defaultDate: index === 0 ?  min : max,
          minDate: index === 0 ? min : new Date(stockChart.rangeSelector.inputFields.get("startValue")),
          maxDate: index == 0 ? new Date(stockChart.rangeSelector.inputFields.get("endValue")) : max,
          dateFormat: "yy-mm-dd",
          onSelect: function(dateText) {
            var event = new Event("change");
            if(index === 0) {
              jQuery(jQuery(".canvasjs-input-field")[0]).val(new Date(dateText));
              jQuery(".canvasjs-input-field")[0].dispatchEvent(event);
              jQuery(jQuery(".canvasjs-input-field")[1]).datepicker("option","minDate", new Date(dateText) );
            } else {
              jQuery(jQuery(".canvasjs-input-field")[1]).val(new Date(dateText));
              jQuery(".canvasjs-input-field")[1].dispatchEvent(event);
              jQuery(jQuery(".canvasjs-input-field")[0]).datepicker("option","maxDate", new Date(dateText) );
            }
          }
        });
      });
      jQuery(window).on("blur", function(){
        hideDatePicker();
      });
    });
    function hideDatePicker() {
      jQuery(".canvasjs-input-field").each(function() {
        jQuery(this).datepicker("hide");
      });
    }
}
};

export {
    dateChart,
  };