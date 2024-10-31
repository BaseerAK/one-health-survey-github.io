document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar", // Chart type: bar, line, pie, etc.
      data: {
        labels: ["Label1", "Label2", "Label3"], // X-axis labels
        datasets: [{
          label: "Sample Dataset",
          data: [10, 20, 30], // Y-axis data
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
  