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
                        text: 'Minutes Spent'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    const timeRangeSelector = document.getElementById("time-range");

    // Mock data for activity tracking
    const activityData = {
        today: {
            "Category 1": 180,
            "Category 2": 240,
            "Category 3": 120
        },
        last7days: {
            "2024-11-03": { "Category 1": 120, "Category 2": 180 },
            "2024-11-04": { "Category 1": 180, "Category 2": 60 },
            "2024-11-05": { "Category 1": 60, "Category 3": 240 },
            "2024-11-06": { "Category 2": 180, "Category 3": 120 },
            "2024-11-07": { "Category 1": 240, "Category 2": 120, "Category 3": 60 },
        }
    };

    // Function to update the graph
    function updateGraph() {
        const timeRange = timeRangeSelector.value;
        const selectedCategories = Array.from(
            document.querySelectorAll(".include-checkbox:checked")
        ).map(cb => cb.dataset.category);

        graphData.labels = [];
        graphData.datasets = [];

        if (timeRange === "today") {
            graphData.labels = selectedCategories;
            graphData.datasets.push({
                label: "Minutes Spent",
                data: selectedCategories.map(cat => activityData.today[cat] || 0),
                backgroundColor: "rgba(75, 192, 192, 0.5)"
            });
        } else {
            const days = Object.keys(activityData.last7days);
            graphData.labels = days;

            selectedCategories.forEach((category, idx) => {
                graphData.datasets.push({
                    label: category,
                    data: days.map(day => activityData.last7days[day][category] || 0),
                    backgroundColor: `rgba(${100 + idx * 50}, ${150 + idx * 30}, ${200 - idx * 20}, 0.5)`
                });
            });
        }

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
        const time = categoryTimeInput.value; // Get the time entered by the user (in minutes)
        const date = categoryDateInput.value;
        const description = categoryDescriptionInput.value;

        // Validate the time input
        if (isNaN(time) || time < 0 || time > 1440) {
            alert("Please enter a valid number for time (0-1440 minutes).");
            return;
        }

        // Ensure the date is provided
        if (!date) {
            alert("Please select a valid date.");
            return;
        }

        console.log("Category Name:", name);
        console.log("Category Time (in minutes):", time); // Log the time in minutes
        console.log("Category Date:", date); // Log the date input
        console.log("Category Description:", description);

        modal.style.display = "none"; // Close the modal
        categoryForm.reset(); // Reset the form after submission
    });

    // Close the modal if the user clicks outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none"; // Close the modal when clicking outside
            categoryForm.reset(); // Reset the form when closing
        }
    };
});
