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
                    beginAtZero: true
                }
            }
        }
    });

    const timeRangeSelector = document.getElementById("time-range");

    // Mock data for demo
    const activityData = {
        today: {
            "Category 1": 3,
            "Category 2": 4,
            "Category 3": 2
        },
        last7days: {
            "2024-11-03": { "Category 1": 2, "Category 2": 3 },
            "2024-11-04": { "Category 1": 3, "Category 2": 1 },
            "2024-11-05": { "Category 1": 1, "Category 3": 4 },
            "2024-11-06": { "Category 2": 3, "Category 3": 2 },
            "2024-11-07": { "Category 1": 4, "Category 2": 2, "Category 3": 1 },
        }
    };

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
                label: "Hours Spent",
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
});
