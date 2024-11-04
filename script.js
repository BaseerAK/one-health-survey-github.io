function showSection(sectionId) {
  // Get the parent section of the clicked button
  const parentSection = document.getElementById(sectionId).closest('section');
  
  // Hide all subsections within the current parent section
  parentSection.querySelectorAll('.subsection').forEach(subsection => {
    subsection.style.display = 'none';
  });
  
  // Show the specific subsection based on sectionId
  document.getElementById(sectionId).style.display = 'block';

  // Initialize chart if the subsection contains a chart
  if (sectionId.includes("Chart")) {
    initializeChart(sectionId);
  }
}


function initializeChart(chartId) {
  const ctx = document.getElementById(chartId).getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: { labels: ["Detection", "Prediction"], datasets: [{ data: [33, 6], backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"] }] },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeChart("purposeChart");  // initialize first chart
});
