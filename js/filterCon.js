function initializeContinentFilter(curbInfo, events) {
  const streetName = new Set();
  const startingStreetName = new Set();
  const endStreetName = new Set();

  //console.log("GeoJSON features length:", curbInfo.features.length);  // Log the length of the features array

  curbInfo.features.forEach(feature => {
   //z   console.log("Checking feature:", feature);  // Log each feature
      if (feature.properties ) {
          streetName.add(feature.properties.strt_nm);
          endStreetName.add(feature.properties.end_st_);
          startingStreetName.add(feature.properties.strt_s_);
          }
  });

  const select = document.getElementById('on-select');
  const select1 = document.getElementById('start-select');
  const select2 = document.getElementById('end-select');
  //console.log("Unique street found:", streetName); 

  streetName.forEach(street => {
      const option = document.createElement('option');
      option.value = street;
      option.textContent = street;
      select.appendChild(option);
  });
  endStreetName.forEach(street => {
    const option = document.createElement('option');
    option.value = street;
    option.textContent = street;
    select2.appendChild(option);
});
startingStreetName.forEach(street => {
  const option = document.createElement('option');
  option.value = street;
  option.textContent = street;
  select1.appendChild(option);
});
  const newEvent = new CustomEvent('filter-curbs', { detail: { streetName }});
  events.dispatchEvent(newEvent);
  console.log("evt:", newEvent);
  }
  
  export {
    initializeContinentFilter,
  };
  