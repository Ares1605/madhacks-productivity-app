document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("activityGraph").getContext("2d");

    // Initial data structure for the graph
    let graphData = {
        labels: [],
        datasets: []
    };

    // Chart.js bar graph setup
    const activityChart = new Chart(ctx, {
        type: 'bar',
        data: graphData,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Category or Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Hours Spent'
                    },
                    beginAtZero: true,
                    suggestedMax: 5, // Adjust the suggested max value to leave space above the highest value
                    stepSize: 1, // Set the step size for the y-axis to 1 hour increments
                }
            }
        }
    });

    const timeRangeSelector = document.getElementById("time-range");

    // Function to fetch and process the actual activity data from the API
    async function fetchActivityData(username) {
        try {
            const response = await fetch(`https://api.arrietty.org/items/${username}`);
            const data = await response.json();

            // Process the data into the required format
            const activityData = {
                today: {
                    "Entertainment": 0,
                    "Productivity": 0,
                    "Friends and Family Time": 0
                },
                last7days: {}
            };

            // Get today's date for comparison
            const today = new Date().toISOString().split('T')[0];

            // Process each item from the API response
            data.forEach(item => {
                const date = new Date(item.date_from);
                const dateKey = date.toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)

                // Only include items within the last 7 days
                if (dateKey >= today) {
                    const section = item.section;
                    const duration = parseInt(item.duration, 10);

                    // Add the duration to the correct section for today
                    if (dateKey === today) {
                        if (activityData.today[section] === undefined) {
                            activityData.today[section] = 0;
                        }
                        activityData.today[section] += duration;
                    }

                    // Add the duration to the correct section for the last 7 days
                    if (!activityData.last7days[dateKey]) {
                        activityData.last7days[dateKey] = {};
                    }
                    if (activityData.last7days[dateKey][section] === undefined) {
                        activityData.last7days[dateKey][section] = 0;
                    }
                    activityData.last7days[dateKey][section] += duration;
                }
            });

            return activityData;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    // Function to update the graph
    async function updateGraph() {
        const username = "something"; // Replace with the actual username
        const timeRange = timeRangeSelector.value;
        const selectedCategories = Array.from(
            document.querySelectorAll(".include-checkbox:checked")
        ).map(cb => cb.dataset.category);

        graphData.labels = [];
        graphData.datasets = [];

        let maxValue = 0; // Variable to track the maximum value for the y-axis

        // Map selected categories to their actual names for display
        const categoryNames = {
            "Category 1": "Entertainment",
            "Category 2": "Productivity",
            "Category 3": "Friends and Family Time",
            "Category 4": "Daily Necessities",
            "Category 5": "Travel",
            "Category 6": "Idle Time"
        };

        const activityData = await fetchActivityData(username);

        if (activityData === null) {
            return; // If there's an error fetching data, exit early
        }

        if (timeRange === "today") {
            // Set the graph labels to category names from selected categories
            graphData.labels = selectedCategories.map(category => categoryNames[category]);
            const data = selectedCategories.map(cat => (activityData.today[categoryNames[cat]] || 0) / 60);  // Convert minutes to hours
            maxValue = Math.max(...data); // Find the max value

            graphData.datasets.push({
                label: "Hours Spent",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.5)"
            });
        } else if (timeRange === "last7days") {
            const days = Object.keys(activityData.last7days);
            graphData.labels = days;

            selectedCategories.forEach((category, idx) => {
                const categoryName = categoryNames[category];
                const categoryData = days.map(day => (activityData.last7days[day][categoryName] || 0) / 60);  // Convert minutes to hours

                // Update the max value based on category data
                maxValue = Math.max(maxValue, ...categoryData);

                // If there's data to show for the selected category, add it to the datasets
                if (categoryData.some(data => data > 0)) {
                    graphData.datasets.push({
                        label: categoryName,
                        data: categoryData,
                        backgroundColor: `rgba(${100 + idx * 50}, ${150 + idx * 30}, ${200 - idx * 20}, 0.5)`
                    });
                }
            });
        }

        // Add a buffer of 1 hour (or whatever scale fits your data) to the max value
        const suggestedMax = Math.ceil(maxValue) + 1;

        // Update the chart options with the dynamically calculated suggested max
        activityChart.options.scales.y.suggestedMax = suggestedMax;
        activityChart.update();
    }

    timeRangeSelector.addEventListener("change", updateGraph);
    document.querySelectorAll(".include-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", updateGraph);
    });

    updateGraph(); // Initial load

    // Modal handling
    const addButtons = document.querySelectorAll(".add-button");
    const modal = document.getElementById("categoryModal");
    const categoryForm = document.getElementById("categoryForm");
    const categoryNameInput = document.getElementById("categoryName");
    const categoryTimeInput = document.getElementById("categoryTime");
    const categoryDateInput = document.getElementById("categoryDate");
    const categoryDescriptionInput = document.getElementById("categoryDescription");

    // Show modal when add button is clicked
    addButtons.forEach(button => {
        button.addEventListener("click", () => {
            modal.style.display = "block";
        });
    });

    // Get the cross button by its ID and add a click event
    const closeModalButton = document.getElementById("closeModalButton");

    // Close the modal when the close button (cross) is clicked
    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none"; // Simply close the modal
        categoryForm.reset(); // Reset the form
    });

    // Handle form submission
    categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = categoryNameInput.value;
        const time = categoryTimeInput.value; // Get the time entered
        const date = categoryDateInput.value;
        const description = categoryDescriptionInput.value;

        // Save category data to local storage or a database here
        alert(`Category added: ${name}, Time: ${time} mins`);

        modal.style.display = "none"; // Close the modal
        categoryForm.reset(); // Reset the form fields
    });
});
