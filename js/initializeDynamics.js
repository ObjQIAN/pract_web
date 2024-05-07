function initializeDynamics(curbInfo, events) {
    events.addEventListener('filter-curb', function(event) {
        const filteredCurbs = event.detail.filteredCurbs;
        const selectedFeature = filteredCurbs.length > 0 ? filteredCurbs[0] : null;
    
        // Update the HTML element with the selected feature's street name
        const displayElement = document.getElementById('selected-feature');
        if (selectedFeature && selectedFeature.properties && selectedFeature.properties.strt_nm) {
            displayElement.innerHTML = `
            <p id = 'filtered-curb-name-text' style="font-family: Helvetica, Arial, sans-serif;">The curb is on${selectedFeature.properties.strt_nm},</p>
            <p id = 'filtered-startend-name-text' style="font-family: Helvetica, Arial, sans-serif;">The curb starts on ${selectedFeature.properties.strt_s_},</p>
            <p id = 'filtered-startend-name-text' style="font-family: Helvetica, Arial, sans-serif;">The curb ends on on${selectedFeature.properties.end_st_}</p>`;
         }    else {
            displayElement.textContent = "No selection made"; // Fallback text
        }
        var chartData = {
            labels: ['Healthcare', 'Civic', 'Commercial', 'Parking', 'School', 'Quick Grocery'],
            datasets: [{
                label: 'Distance to Nearest Neighbors',
                data: [
                    selectedFeature.properties.healthcare_nn1,
                    selectedFeature.properties.civic_nn1,
                    selectedFeature.properties.commercial_nn1,
                    selectedFeature.properties.parking_nn1,
                    selectedFeature.properties.school_nn1,
                    selectedFeature.properties.quick_grocery_nn1
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', // Red
                    'rgba(54, 162, 235, 0.2)', // Blue
                    'rgba(255, 206, 86, 0.2)',  // Yellow
                    'rgba(75, 192, 192, 0.2)', // Green
                    'rgba(153, 102, 255, 0.2)',// Purple
                    'rgba(255, 159, 64, 0.2)'  // Orange
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                
                borderWidth: 1
            }]
        };
    
        // Check if chart instance already exists
        if (window.myBarChart) {
            window.myBarChart.data = chartData; // Update data
            window.myBarChart.update(); // Update the chart
        } else {
            // Create new chart instance if it doesn't exist
            var ctx = document.getElementById('myChart').getContext('2d');
            window.myBarChart = new Chart(ctx, {
                type: 'bar', // Can change to 'line', 'pie', etc.
                data: chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    });
}

export { initializeDynamics };