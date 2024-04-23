function initializeContinentFilter(curbInfo, events) {
  const uniqueStates = new Set();
  console.log("GeoJSON features length:", curbInfo.features.length);  // Log the length of the features array

  curbInfo.features.forEach(feature => {
      console.log("Checking feature:", feature);  // Log each feature
      if (feature.properties && feature.properties.strt_nm) {
          uniqueStates.add(feature.properties.strt_nm);
      }
  });

  const select = document.getElementById('stateDropdown');
  console.log("Unique states found:", uniqueStates);  // Log the unique states

  uniqueStates.forEach(stateName => {
      const option = document.createElement('option');
      option.value = stateName;
      option.textContent = stateName;
      select.appendChild(option);
  });
  const newEvent = new CustomEvent('filter-curbs', { detail: { uniqueStates }});
  events.dispatchEvent(newEvent);
  }
  
  export {
    initializeContinentFilter,
  };
  