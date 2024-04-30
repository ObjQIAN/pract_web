function initializeContinentFilter(curbInfo, events) {
  const allFeatures = curbInfo.features;

  const select = document.getElementById('on-select');
  const select1 = document.getElementById('start-select');
  const select2 = document.getElementById('end-select');

  // Initial population of all selectors
  populateSelector(select, extractPropertySet(allFeatures, 'strt_nm'));
  populateSelector(select1, extractPropertySet(allFeatures, 'strt_s_'));
  populateSelector(select2, extractPropertySet(allFeatures, 'end_st_'));

  // Add event listeners to all selectors
  [select, select1, select2].forEach(selector => {
      selector.addEventListener('change', () => updateSelectorsBasedOnSelection(select, select1, select2, allFeatures, events));
  });



  document.getElementById('clear-selection').addEventListener('click', function() {
    const select = document.getElementById('on-select');
    const select1 = document.getElementById('start-select');
    const select2 = document.getElementById('end-select');

    // Reset the selectors to their initial unselected state
    select.selectedIndex = 0;
    select1.selectedIndex = 0;
    select2.selectedIndex = 0;

    // Update the selectors based on the new selection
    events.dispatchEvent(new CustomEvent('reset-curbs')); // This is optional and based on your app's logic
    
    //this is a fail apprently
    events.addEventListener('reset-curbs', function() {
        console.log("Filtered curbs data being cleared.");
        filteredCurbsDataStore.clear();
        updateUIAccordingly();
    });


    initializeContinentFilter(curbInfo, events);
    console.log("Selections cleared");
});



}

function extractPropertySet(features, propertyName) {
  const propertySet = new Set();
  features.forEach(feature => {
      if (feature.properties && feature.properties[propertyName]) {
          propertySet.add(feature.properties[propertyName]);
      }
  });
  return propertySet;
}

function updateSelectorsBasedOnSelection(select, select1, select2, allFeatures, events) {
  const selections = {
      'on-select': select.value,
      'start-select': select1.value,
      'end-select': select2.value
  };

  const availableFeatures = allFeatures.filter(feature => {
      return (!selections['on-select'] || feature.properties.strt_nm === selections['on-select']) &&
             (!selections['start-select'] || feature.properties.strt_s_ === selections['start-select']) &&
             (!selections['end-select'] || feature.properties.end_st_ === selections['end-select']);
  });

  // Update each selector except for the one that initiated the change
  if (document.activeElement !== select) {
      populateSelector(select, extractPropertySet(availableFeatures, 'strt_nm'));
  }
  if (document.activeElement !== select1) {
      populateSelector(select1, extractPropertySet(availableFeatures, 'strt_s_'));
  }
  if (document.activeElement !== select2) {
      populateSelector(select2, extractPropertySet(availableFeatures, 'end_st_'));
  }

  if (select.value && select1.value && select2.value) {
    const filteredCurbs = availableFeatures; // Use this variable as needed for more specific filtering
    const newEvent = new CustomEvent('filter-curb', { detail: { filteredCurbs } });
    events.dispatchEvent(newEvent);
    console.log("Custom event dispatched with filtered curbs:", filteredCurbs);
}
}

function populateSelector(selector, data) {
  const currentSelection = selector.value;
  selector.innerHTML = '<option value="">Select an option</option>';
  data.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      if (item === currentSelection) {
          option.selected = true;
      }
      selector.appendChild(option);
  });
  // Re-enable the previously selected item if it still exists
  if (data.has(currentSelection)) {
      selector.value = currentSelection;
  }
}

export {
  initializeContinentFilter,
};