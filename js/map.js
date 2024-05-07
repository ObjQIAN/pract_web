function initializeMap(curbInfo,poiInfo, events) {
  const map = L.map('map').setView([39.95, -75.16], 15); // center of Philadelphia

  var mapBoxBase = L.tileLayer('https://api.mapbox.com/styles/v1/ltscqian/clvcrfxcn04dr01pk2ig08a1e/tiles/256/{z}/{x}/{y}@2x?access_token={apiKey}', {
    apiKey: 'pk.eyJ1IjoibHRzY3FpYW4iLCJhIjoiY2t1MGhqcDc2MWU2dzJ1dGh1MnRlanJkYiJ9.evZuw4tNS1sR4QF9vta6xQ',
    maxZoom: 24,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  }).addTo(map);

  const curbLayer = L.layerGroup(); 
  const poiLayer = L.layerGroup();
  const markerLayer = L.layerGroup();
  markerLayer.addTo(map);
  curbLayer.addTo(map); 
  poiLayer.addTo(map);

  events.addEventListener('filter-curb', (evt) => { // when the user filters the stations
    const filteredCurbsGrp = evt.detail.filteredCurbs;
    //console.log('Filtered curbsbgrp:', filteredCurbsGrp);
    const filteredCurbs = filteredCurbsGrp.length > 0 ? filteredCurbsGrp[0] : null;
    //console.log('Filtered curbs:', filteredCurbs);
    
    const coords = filteredCurbs.geometry.coordinates;
      const midIndex = Math.floor(coords.length / 2);
      const [lngMid, latMid] = coords[midIndex]; // Getting the midpoint coordinate pair
      const marker = L.marker([latMid, lngMid]);//.addTo(map)
      markerLayer.addLayer(marker);
      marker.bindPopup(
        `
          <h2 class="country-name">${filteredCurbs.properties.strt_nm}</h2>
          <p class="continent">Start Street: ${filteredCurbs.properties.strt_s_}</p>
          <p class="continent">End Street: ${filteredCurbs.properties.end_st_}</p>
          <p class="continent">Street Policy: ${filteredCurbs.properties.rgltn_t}</p>
          <p class="area_km2">Street Class: ${filteredCurbs.properties.Road_Class}</p>
        `
      );
      marker.openPopup();
     map.setView([latMid, lngMid], 18);

  });


  events.addEventListener('reset-curbs', (evt) => { // when the user filters the stations
    map.closePopup();
    markerLayer.clearLayers();
    map.setView([39.95, -75.16], 15);
  });


  var baseMaps = {
    "Base Map": mapBoxBase,
  };
  var overlayMaps = {
    "Curbs": curbLayer,
    "Points of Interest": poiLayer
    
  };
  var layerControl = L.control.layers(baseMaps,overlayMaps).addTo(map)
  updateWorldMap(curbInfo, curbLayer); // add all the countries to the map
  updatePOIMap(poiInfo, poiLayer);
  /*  var markers = L.markerClusterGroup();
  L.geoJSON(poiInfo, {
    onEachFeature: function (feature, layer) {
      var marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
      marker.bindPopup(`Poi Type: ${feature.properties.simple_category}`);
      markers.addLayer(marker);
    }
  });
  map.addLayer(markers); */ // using marker cluster group to cluster the markers


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
      0.0: '#C8FDFF',   // Blue
      0.2: '#74e9ee',   // Cyan
      0.4: '#64e4c0',   // Green
      0.6: '#85d983',   // Yellow
      0.8: '#c3af33',   // Orange
      1.0: '#eb7912'    // Red
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
          <p class="continent">Street Policy: ${feature.properties.rgltn_t}</p>
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
      switch (feature.properties.rgltn_t) {
          case "no_stopping":
              color = '#FFBC00';
              weight = 2;
              break;
          case "parking":
              color = '#FF9D00';
              weight = 3;
              break;
          case "time_limited_parking":
              color = '#FF4800';
              weight = 4;
              break;
          case "loading":
              color = '#FF5F47';
              weight = 5;
              break;
          case "passenger":
              color = '#FF4AD0';
              weight = 7;
              break;
          case "pay_parking":
              color = '#FF19A6';
              weight = 9;
              break;
          case "no_parking":
              color = '#FF19A6';
              weight = 9;
              break;
          case "no_standing":
              color = '#FF19A6';
              weight = 9;
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
