function initializeMap(curbInfo, events) {
  const map = L.map('map').setView([39.95, -75.16], 15); // center of Philadelphia

  L.tileLayer('https://api.mapbox.com/styles/v1/ltscqian/clvcrfxcn04dr01pk2ig08a1e/tiles/256/{z}/{x}/{y}@2x?access_token={apiKey}', {
    apiKey: 'pk.eyJ1IjoibHRzY3FpYW4iLCJhIjoiY2t1MGhqcDc2MWU2dzJ1dGh1MnRlanJkYiJ9.evZuw4tNS1sR4QF9vta6xQ',
    maxZoom: 24,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  }).addTo(map);
 
  const curbLayer = L.layerGroup(); 
  const poiLayer = L.layerGroup();
  curbLayer.addTo(map); 


  updateWorldMap(curbInfo, curbLayer); // add all the countries to the map

  events.addEventListener('filter-curbs', (evt) => { // when the user filters the stations
    const filteredCurb = evt.detail.filteredCurb;
    updateMapCurbs(filteredCurb, curbLayer);
  });
  return map;
}


function updateWorldMap(curbInfo, curbLayer) {
  curbLayer.clearLayers(); 

  L.geoJSON(curbInfo, {

    style: getstyle,
    onEachFeature: function (feature, layer) {

      if (feature.properties) {
        
        const popupContent = `
          <h2 class="country-name">${feature.properties.strt_nm}</h2>
          <p class="continent">Start Street: ${feature.properties.strt_s_}</p>
          <p class="continent">End Street: ${feature.properties.end_st_}</p>
          <p class="continent">Street Policy: ${feature.properties.categry}</p>
          <p class="area_km2">Street Class: ${feature.properties.Road_Class}</p>
        `;
        layer.bindPopup(popupContent);

      };}

  }).addTo(curbLayer);
  

}
//updatePieChartWithFilteredCountries(feature.properties);

function getstyle(feature) {
 // console.log('Styling feature:', feature);
  // Example: Set color and line weight based on a property
  let color = '#FF0000'; // default color
  let weight = 5; // default line weight

  if (feature.properties) {
      // Change color and weight based on the status property
      switch (feature.properties.Road_Class) {
          case 1:
              color = '#FFBC00';
              weight = 2;
              
              break;
          case 2:
              color = '#FF9D00';
              weight = 3;
              break;
          case 3:
              color = '#FF4800';
              weight = 4;
              break;
          case 4:
              color = '#FF5F47';
              weight = 5;
              break;
          case 5:
              color = '#FF4AD0';
              weight = 7;
              break;
          default:
              color = '#FFDF19';
              weight = 1;
      }
  }

  return {
      color: color,
      weight: weight,
      opacity: 1
  };
}

export {
  initializeMap,
};
