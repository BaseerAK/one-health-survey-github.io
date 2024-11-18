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
    let htmlTable = XLSX.utils.sheet_to_html(sheet);

    // Add a custom class to the table tag
    const uniqueId = `dataTable-${containerId}`;
    htmlTable = htmlTable.replace('<table', `<table class="excel-table" id="${uniqueId}"`);
    $(`#${uniqueId}`).DataTable();

    // Wrap the table in a container div for styling and responsiveness
    const tableContainer = document.getElementById(containerId);
    tableContainer.innerHTML = `<div class="excel-table-container">${htmlTable}</div>`;

    // Debug: Check the rendered table structure
    console.log("Generated Table HTML:", tableContainer.innerHTML);

    // After table creation, initialize DataTables
    try {
      $('#dataTable').DataTable(); // Initialize DataTables
    } catch (error) {
      console.error("DataTables initialization failed:", error);
    }

    // Replace "P" with checkmarks after table creation
    replacePWithCheckmark(containerId);

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
    'grid-tasks': 'Tasks',
    'grid-visual': 'Visual Representations',
    'grid-analytics': 'Visual Analytics Techniques (Ap',
    'grid-interactive': 'Interactive Analysis Ability',
    'grid-paper': 'Paper Type',
    'grid-system': 'System or Dashboard',
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

function replacePWithCheckmark(containerId) {
  const tableContainer = document.getElementById(containerId);
  if (!tableContainer) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }
  
  const cells = tableContainer.querySelectorAll("td");
  if (cells.length === 0) {
    console.warn(`No table cells found in container ${containerId}`);
  }

  cells.forEach(cell => {
    const cellContent = cell.textContent.trim();
    console.log(`Checking cell content: "${cellContent}"`); // Log cell content

    // Check if cell content is "P" or matches typical tickmark alternatives
    if (cellContent === "P" ) {
      cell.innerHTML = "&#10003;"; // Unicode for checkmark
      cell.classList.add("checkmark"); // Optional CSS class for styling
      console.log(`Replaced "P" with checkmark in cell.`);
    }
  });
}


// Ensure replacePWithCheckmark() is called after table is created
function displayTable(data) {
  const tableContainer = document.getElementById("excelTableContainer");
  tableContainer.innerHTML = ""; // Clear previous data

  const table = document.createElement("table");
  data.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
          const cellElement = document.createElement(rowIndex === 0 ? "th" : "td");
          cellElement.textContent = cell || ""; // Populate cell
          tr.appendChild(cellElement);
      });
      table.appendChild(tr);
  });

  tableContainer.appendChild(table);
  replacePWithCheckmark(); // Run after table creation
}


// function initializeChart(chartId) {
//   const ctx = document.getElementById(chartId).getContext('2d');
//   if (!ctx) return;

//   new Chart(ctx, {
//     type: "bar",
//     data: { labels: ["Detection", "Prediction"], datasets: [{ data: [33, 6], backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"] }] },
//     options: { responsive: true, scales: { y: { beginAtZero: true } } }
//   });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   initializeChart("purposeChart");  // initialize first chart
// });

/*display only image screen for paper*/
//obtain modal
var modal = document.getElementById('imageModal')

//obtain image and insert into modal
var img = document.getElementsByClassName("modalImage");
var modalimg = document.getElementById("image");

var presentModal = function(){
  modal.style.display = "block";
  modalimg.src = this.src;
}

for(i = 0; i < img.length; i++){
  img[i].addEventListener('click', presentModal);
}

var span = document.getElementsByClassName("close")[0];

span.onclick = function(){
  modal.style.display = "none";
}