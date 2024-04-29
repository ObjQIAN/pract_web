import { initializeMap } from './map.js';

import { initializeList } from './list.js';
import { initializeSearch } from './search.js';
import { initializeContinentFilter } from './filterConBack.js'; 
import { initializeplot } from './plot.js';
import { handleSearchBoxInput } from './plot.js';
import { updateUrl } from './updateUrl.js';
import { showSupport } from './showSupport.js';
import { dateChart } from './dataCharts.js';  


const CurbInfoResp = await fetch('https://raw.githubusercontent.com/ObjQIAN/warehousepub/main/filtered.geojson');
const CurbInfo = await CurbInfoResp.json();

const CurbInfoRespA = await fetch('https://canvasjs.com/data/docs/ltceur2018.json');
const dataForCurb = await CurbInfoRespA.json();
var countryToPlot = [];
const events = new EventTarget();


function initializeFromUrl(events,CurbInfo) {
    const params = new URLSearchParams(window.location.search);
    const countryToPlotProto = params.get('country');
    if (countryToPlotProto) {

      
      countryToPlot = countryToPlotProto.split(',');
      //console.log(countryToPlot);
      handleSearchBoxInput(countryToPlot, CurbInfo,events);
      const loadPage = new CustomEvent('loadPage', { detail: { countryToPlot } });
      events.dispatchEvent(loadPage);
    
    };
    
  }
  
  // When the page loads
  document.addEventListener("DOMContentLoaded", initializeFromUrl(events,CurbInfo));

  

initializeMap(CurbInfo, events);

initializeList(CurbInfo, events,countryToPlot);
initializeSearch(CurbInfo, events);
initializeContinentFilter(CurbInfo, events);
initializeplot(CurbInfo, events,countryToPlot);
dateChart(dataForCurb, events);
updateUrl(events) ;
showSupport()