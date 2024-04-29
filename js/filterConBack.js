function initializeContinentFilter(curbInfo, events) {
  console.log('CurbInfo.features:', CurbInfo.features)

  function populateSelector(selectorId, options) {
    const selector = document.getElementById(selectorId);
    selector.innerHTML = `<option value="">Select ${selectorId.split('-')[0]}</option>`; // Reset options
    [...new Set(options)].forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option;
        optElement.textContent = option;
        selector.appendChild(optElement);
    });
  };

// Populate selectors initially
populateSelector('start-select', curbInfo.map(feature  => feature.properties.strt_s_));
populateSelector('end-select', curbInfo.map(feature  => feature.properties.end_st_));
populateSelector('on-select', curbInfo.map(feature  => feature.properties.strt_nm));

// Update other selectors based on the current selection
function updateSelectors(currentSelectorId, selectedValue) {
    const filteredInfo = curbInfo.filter(info => info[currentSelectorId.split('-')[0]] === selectedValue);
    const selectorsToUpdate = ['start-select', 'end-select', 'on-select'].filter(id => id !== currentSelectorId);

    selectorsToUpdate.forEach(selectorId => {
        const property = selectorId.split('-')[0];
        populateSelector(selectorId, filteredInfo.map(info => info[property]));
    });
}

// Attach event listeners to selectors
document.getElementById('start-select').addEventListener('change', function() {
    updateSelectors('start-select', this.value);
});

document.getElementById('end-select').addEventListener('change', function() {
    updateSelectors('end-select', this.value);
});

document.getElementById('on-select').addEventListener('change', function() {
    updateSelectors('on-select', this.value);
});
};


  
  
  export {
    initializeContinentFilter,
  };
  