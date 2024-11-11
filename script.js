function showSection(subsectionId) {
  // Hide all subsections within the same section
  const section = document.getElementById(subsectionId).closest("section");
  const subsections = section.querySelectorAll(".subsection");
  subsections.forEach(subsection => {
      subsection.style.display = "none";
  });

  // Show the clicked subsection
  document.getElementById(subsectionId).style.display = "block";
}


async function loadExcelSheet(sheetName, containerId) {
  // Fetch the Excel file
  const response = await fetch('papers.xlsx'); // Replace with your Excel file path
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Get the specified sheet by name
  const sheet = workbook.Sheets[sheetName];
  if (sheet) {
      // Convert the sheet to HTML
      const htmlTable = XLSX.utils.sheet_to_html(sheet);
      // Inject the HTML table into the specified container
      document.getElementById(containerId).innerHTML = htmlTable;
  } else {
      document.getElementById(containerId).innerHTML = "<p>Sheet not found.</p>";
  }
}

// Function to handle showing the correct section and loading the table if it's a massive table section
function showGrid(subsectionId) {
  const section = document.getElementById(subsectionId).closest("section");
  const subsections = section.querySelectorAll(".subsection");
  subsections.forEach(subsection => {
      subsection.style.display = "none";
  });

  // Show the clicked subsection
  document.getElementById(subsectionId).style.display = "block";

  // Ensure the sectionId matches the expected pattern for sheetMap
  const sheetMap = {
    'grid-purpose': 'Purpose of the System',
    'grid-diseases': 'Diseases',
    'grid-datasets': 'Datasets Type',
    'grid-users': 'Users',
  };

  const sheetName = sheetMap[subsectionId];
  const containerId = `excelTableContainer-${subsectionId.split('-')[1]}`;

  // Only load the Excel sheet if there is a matching sheet name
  if (sheetName) {
      loadExcelSheet(sheetName, containerId);
  } else {
      console.error(`No matching sheet name found for sectionId: ${subsectionId}`);
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
