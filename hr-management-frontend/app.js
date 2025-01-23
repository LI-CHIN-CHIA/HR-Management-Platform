const API_URL = "http://localhost:8000/employees";

const employeeTableBody = document.getElementById("employee-table-body");
const employeeForm = document.getElementById("employee-form");
const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");

const addEmployeeHandler = async (event) => {
  event.preventDefault();
  const formData = new FormData(employeeForm);

  const employee = {
    id: Date.now(),
    name: formData.get("name"),
    position: formData.get("position"),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });

    if (!response.ok) {
      throw new Error("Failed to add employee");
    }

    employeeForm.reset();
    fetchEmployees();
  } catch (error) {
    console.error("Error adding employee:", error);
    alert("Failed to add employee. Please try again later.");
  }
};

employeeForm.onsubmit = addEmployeeHandler;
// Fetch and display employees
async function fetchEmployees() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }
    const employees = await response.json();
    employeeTableBody.innerHTML = "";

    employees.forEach((employee) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${employee.id}</td>
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>
          <button onclick="deleteEmployee(${employee.id})">Delete</button>
          <button onclick="editEmployee(${employee.id})">Edit</button>
        </td>
      `;
      employeeTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    alert("Failed to fetch employees. Please try again later.");
  }
}

// Delete employee
async function deleteEmployee(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete employee");
    }
    fetchEmployees();
  } catch (error) {
    console.error("Error deleting employee:", error);
    alert("Failed to delete employee. Please try again later.");
  }
}

// Edit employee
async function editEmployee(id) {
  const employeeRow = Array.from(employeeTableBody.querySelectorAll("tr")).find(
    (row) => {
      const deleteButton = row.querySelector("button[onclick]");
      return (
        deleteButton &&
        deleteButton.onclick.toString().includes(`deleteEmployee(${id})`)
      );
    }
  );

  if (!employeeRow) {
    alert("Employee not found!");
    return;
  }

  const nameCell = employeeRow.querySelector("td:nth-child(2)");
  const positionCell = employeeRow.querySelector("td:nth-child(3)");

  document.getElementById("name").value = nameCell.textContent;
  document.getElementById("position").value = positionCell.textContent;

  employeeForm.onsubmit = async (event) => {
    event.preventDefault();

    const updatedEmployee = {
      id: id,
      name: document.getElementById("name").value,
      position: document.getElementById("position").value,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      alert("Employee updated successfully!");
      employeeForm.reset();
      fetchEmployees();

      employeeForm.onsubmit = addEmployeeHandler;
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee. Please try again later.");
    }
  };
}
// Upload Excel file and display data
uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file before uploading.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/upload-excel", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload Excel file.");
    }

    const result = await response.json();
    alert("File uploaded successfully!");
    displayTableData(result.data);
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Failed to upload file. Please try again.");
  }
});

let allEmployees = [];

function displayTableData(data) {
  const existingRows = Array.from(employeeTableBody.querySelectorAll("tr"));
  const existingData = existingRows.map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      id: parseInt(cells[0].textContent),
      name: cells[1].textContent,
      position: cells[2].textContent,
    };
  });

  allEmployees = [...existingData];

  data.forEach((row, index) => {
    const id = allEmployees.length + 1;
    allEmployees.push({
      id: id,
      name: row.name,
      position: row.position,
    });
  });

  console.log("All Employees Data:", allEmployees);
  syncTableDataToBackend();
}

async function syncTableDataToBackend() {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allEmployees),
    });
    renderTableFromAllEmployees();

    if (!response.ok) {
      throw new Error("Failed to sync data to backend");
    }

    alert("Table data synced successfully to backend!");
  } catch (error) {
    console.error("Error syncing table data:", error);
    alert("Failed to sync data to backend. Please try again.");
  }
}

function renderTableFromAllEmployees() {
  employeeTableBody.innerHTML = "";

  allEmployees.forEach((employee) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${employee.id}</td>
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>
        <button onclick="deleteEmployee(${employee.id})">Delete</button>
        <button onclick="editEmployee(${employee.id})">Edit</button>
      </td>
    `;
    employeeTableBody.appendChild(tr);
  });
}

// Initial fetch
fetchEmployees();
