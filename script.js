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
  const response = await fetch('papersRevision.xlsx'); // Replace with your Excel file path
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Get the specified sheet by name
  const sheet = workbook.Sheets[sheetName];
  
  if (sheet) {
    let htmlTable = XLSX.utils.sheet_to_html(sheet); // Ensure headers are included

    // Parse the HTML table and fix structure issues
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTable, 'text/html');
    const table = doc.querySelector('table');

    // // Ensure the table has correct structure
    // cleanTableStructure(table);
    
    // Ensure the table has <thead> and <tbody>
    const rows = table.querySelectorAll('tr');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // // Process all rows, skipping empty rows
    // rows.forEach((row, index) => {
    //   const isRowEmpty = Array.from(row.cells).every(cell => cell.textContent.trim() === '');
    //   if (isRowEmpty) {
    //     return; // Skip empty rows
    //   }
    //   if (index < 3) {
    //     thead.appendChild(row); // First three rows are headers
    //   } else {
    //     tbody.appendChild(row); // Fourth row onwards are data
    //   }
    // });

    rows.forEach((row, index) => {
      // Check if the row is empty
      const isRowEmpty = Array.from(row.cells).every(cell => cell.textContent.trim() === '');
      if (isRowEmpty) {
        return; // Skip empty rows
      }

      // Handle specific sections
      if (containerId === 'excelTableContainer-visual' || containerId === 'excelTableContainer-analytics') {
        if (index < 3) {
          thead.appendChild(row); // First three rows are headers
        } else {
          tbody.appendChild(row); // Fourth row onwards are data
        }
      } else {
        if (index === 0 || index === 1) {
          thead.appendChild(row); // First row is the header
        } else {
          tbody.appendChild(row); // Rest are data
        }
      }
    });
    

    

    // // Remove problematic tbody with placeholder rows
    // table.querySelectorAll('tbody').forEach(tbody => {
    //   const rows = tbody.querySelectorAll('tr');
    //   if (rows.length === 1 && rows[0].classList.contains('odd')) {
    //     console.log("Removing tbody with placeholder row");
    //     tbody.remove(); // Remove if it has only one row with class="odd"
    //   }
    // });

    table.appendChild(thead);
    table.appendChild(tbody);

    // // Add a custom class and unique ID to the table
    // const uniqueId = `dataTable-${containerId}`;
    // table.setAttribute('id', uniqueId);
    // table.classList.add('excel-table');

    // // Wrap the table in a container div for styling and responsiveness
    // const tableContainer = document.getElementById(containerId);
    // tableContainer.innerHTML = `<div class="excel-table-container"></div>`;
    // tableContainer.querySelector('.excel-table-container').appendChild(table);

    // Add a unique ID to the table
    const uniqueId = `dataTable-${containerId}`;
    table.setAttribute('id', uniqueId);

    // Insert the table into the container
    const tableContainer = document.getElementById(containerId);
    tableContainer.innerHTML = ''; // Clear previous content
    tableContainer.appendChild(table);

   

    // Clean up data in the first column
    table.querySelectorAll('tbody tr').forEach(row => {
      const cell = row.cells[0]; // First column cell
      if (cell) {
        // console.log("Cleaning up cell content:", cell.textContent);
        cell.textContent = cell.textContent.trim(); // Remove any leading/trailing spaces
      }
    });

    console.log("Data in first column before sorting:");
    table.querySelectorAll('tbody tr').forEach(row => {
      console.log(row.cells[0]?.textContent.trim()); // Log first column data
    });

    console.log("Final table structure:");
    console.log(table.outerHTML);



    cleanTableStructure(table);
    console.log(XLSX.utils.sheet_to_json(sheet).length, "rows loaded from sheet");


    if ($.fn.DataTable.isDataTable(`#${uniqueId}`)) {
      $(`#${uniqueId}`).DataTable().destroy(); // Properly destroy the existing instance
    }
    
    const tableSelector = `#${uniqueId}`;
    const dataTable = $(tableSelector).DataTable({
      autoWidth: false,
      responsive: true,
      paging: true,
      searching: false,
      order: [[0, 'asc']],
      columnDefs: [
        { targets: 0, type: 'string', orderable: true },
        { targets: '_all', orderable: false }
      ],
    });
    
     // Add search functionality
     const searchInput = $(`${uniqueId}_filter input`);
     searchInput.off('input').on('input', function () {
         const searchValue = $(this).val();
         dataTable.search(searchValue).draw();
     });
    
    
    cleanTableStructure(table); // Ensures rendering issues are resolved

    
    
    
    // console.log("Table visibility:", $(`#${uniqueId}`).is(':visible'));

    console.log("new99");

    // Remove problematic tbody with placeholder rows
    table.querySelectorAll('tbody').forEach(tbody => {
      const rows = tbody.querySelectorAll('tr');
      if (rows.length === 1 && rows[0].classList.contains('odd')) {
        console.log("Removing tbody with placeholder row");
        tbody.remove(); // Remove if it has only one row with class="odd"
      }
    });

    // Reapply fixes after DataTables renders
    $(`#${uniqueId}`).on('draw.dt', function () {
      console.log('Reapplying fixes after DataTables redraw');
      const table = document.querySelector(`#${uniqueId}`);
      if (table) {
        cleanTableStructure(table);
        replacePWithCheckmark(containerId);
      }
    });


   

    // Replace "P" with checkmarks after table creation
    replacePWithCheckmark(containerId);
  } else {
    document.getElementById(containerId).innerHTML = "<p>Sheet not found.</p>";
  }
}

// Function to clean the table structure
function cleanTableStructure(table) {
  // Remove any empty or placeholder tbody elements
  table.querySelectorAll('tbody').forEach((tbody) => {
    const rows = tbody.querySelectorAll('tr');
    if (rows.length === 1 && rows[0].classList.contains('odd')) {
      console.log('Removing tbody with placeholder row');
      tbody.remove();
    }
  });

  // Ensure there is only one <tbody> element
  const allBodies = table.querySelectorAll('tbody');
  if (allBodies.length > 1) {
    console.warn('Multiple <tbody> elements detected. Merging...');
    const mainTbody = allBodies[0];
    for (let i = 1; i < allBodies.length; i++) {
      const extraTbody = allBodies[i];
      extraTbody.querySelectorAll('tr').forEach((row) => {
        mainTbody.appendChild(row);
      });
      extraTbody.remove();
    }
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
  
  // Clear the container content
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = ''; // Clear the previous content
  }

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
    // console.log(`Checking cell content: "${cellContent}"`); // Log cell content

    // Check if cell content is "P" or matches typical tickmark alternatives
    if (cellContent === "P" ) {
      cell.innerHTML = "&#10003;"; // Unicode for checkmark
      cell.classList.add("checkmark"); // Optional CSS class for styling
      // console.log(`Replaced "P" with checkmark in cell.`);
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
