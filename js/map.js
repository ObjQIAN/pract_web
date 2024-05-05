function initializeMap(curbInfo,poiInfo, events) {
  const map = L.map('map').setView([39.95, -75.16], 15); // center of Philadelphia

  L.tileLayer('https://api.mapbox.com/styles/v1/ltscqian/clvcrfxcn04dr01pk2ig08a1e/tiles/256/{z}/{x}/{y}@2x?access_token={apiKey}', {
    apiKey: 'pk.eyJ1IjoibHRzY3FpYW4iLCJhIjoiY2t1MGhqcDc2MWU2dzJ1dGh1MnRlanJkYiJ9.evZuw4tNS1sR4QF9vta6xQ',
    maxZoom: 24,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  }).addTo(map);
 
  const curbLayer = L.layerGroup(); 
  const poiLayer = L.layerGroup();
  curbLayer.addTo(map); 
  poiLayer.addTo(map);

  events.addEventListener('filter-curb', (evt) => { // when the user filters the stations
    const filteredCurbsGrp = evt.detail.filteredCurbs;
    const filteredCurbs = filteredCurbsGrp.length > 0 ? filteredCurbsGrp[0] : null;
    zoomtoFilteredCurbs(filteredCurbs, curbLayer);
  });

  updateWorldMap(curbInfo, curbLayer); // add all the countries to the map
  updatePOIMap(poiInfo, poiLayer);

  //events.addEventListener('filter-curbs', (evt) => { // when the user filters the stations
   // const filteredCurb = evt.detail.filteredCurb;
    //updateMapCurbs(filteredCurb, curbLayer);
  //});
  return map;
}

function updatePOIMap(poiInfo, poiLayer) {
  poiLayer.clearLayers();  // Clear the existing layer

  // Collect data for the heatmap
  var heatData = [];
  L.geoJSON(poiInfo, {
    onEachFeature: function(feature, layer) {
      if (feature.geometry && feature.geometry.type === 'Point') {
        // Push each point's coordinates and an intensity value into the heatData array
        // The intensity could be a static value or derived from your data
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];
        const intensity = 1;  // For simplicity, using 1; adjust based on your data
        heatData.push([lat, lng, intensity]);
      }
    }
  });

  // Create a heatmap layer and add it to the map
  var heatmap = L.heatLayer(heatData, {
    radius: 20,         // Radius of each "blob"
    blur: 30,           // Blur amount
    maxZoom: 17,        // Max zoom level on which the heat will be visualized
    gradient: {
      0.0: '#00f',   // Blue
      0.2: '#0ff',   // Cyan
      0.4: '#0f0',   // Green
      0.6: '#ff0',   // Yellow
      0.8: '#f90',   // Orange
      1.0: '#f00'    // Red
    }  // Color gradient
  });

  poiLayer.addLayer(heatmap);  // Add the heatmap layer to the existing layer group
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

function zoomtoFilteredCurbs(filteredCurbs, curbLayer) {
    // Check if there are any filtered curbs
    if (filteredCurbs.length === 0) {
      // No filtered curbs, so do nothing or handle this case as needed
      return;
    }
  
    // Initialize bounds to null
    let bounds = null;
  
    // Iterate over each filtered curb
    filteredCurbs.forEach(curb => {
      // Get the geographic coordinates of the curb
      const coordinates = curb.geometry.coordinates;
  
      // Iterate over each coordinate to update the bounds
      coordinates.forEach(coordinate => {
        // Create a LatLng object from the coordinate pair
        const latLng = L.latLng(coordinate[1], coordinate[0]);
  
        // Extend the bounds to include the LatLng object
        if (!bounds) {
          bounds = L.latLngBounds(latLng, latLng);
        } else {
          bounds.extend(latLng);
        }
      });
    });
  
    // Fit the map to the bounds of the filtered curbs
    if (bounds) {
      curbLayer.map.fitBounds(bounds);
    }
}

export {
  initializeMap,
};
