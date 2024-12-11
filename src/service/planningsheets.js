import { checkRole } from '../utils/checkRole.js';

window.onload = fetchPlanningSheets;

function fetchPlanningSheets() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        document.getElementById("result").innerHTML = "Token não encontrado. Faça login novamente.";
        window.location.href = "/index.html";
        return;
    }

    fetch('http://localhost:8080/planningsheets', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            if (!response.ok) {
                window.location.href = "/index.html";
            }
            return response.json();
        })
        .then((data) => {
            displaySheets(data);
        })
        .catch((error) => {
            console.error("Erro:", error);
            document.getElementById("result").innerHTML = "Erro ao carregar folhas de planejamento: " + error.message;
        });
}

function displaySheets(sheets) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = ""; 

  if (!sheets || sheets.length === 0) {
      resultDiv.innerHTML = `<p class="text-gray-500 text-center mt-4">Nenhuma folha de planejamento encontrada.</p>`;
      return;
  }

  const role = checkRole(); 
  const tableContainer = document.createElement("div");
  tableContainer.className = "overflow-x-auto";
  tableContainer.style.maxWidth = "800px"; 
  tableContainer.style.margin = "0 auto"; 

  if (role === 'master'){
    const buttonCreate = document.getElementById("create-button")
    buttonCreate.classList.remove("hidden")
  }

  const table = document.createElement("table");
  table.className = "table-auto w-full bg-white border border-gray-200 rounded-lg shadow-md text-xs sm:text-sm md:text-base";

  table.innerHTML = `
      <thead class="bg-gray-100 text-gray-700">
          <tr>
              <th class="border px-2 py-1 sm:px-4 sm:py-2 text-center">Nome do Cliente</th>
              <th class="border px-2 py-1 sm:px-4 sm:py-2 text-center">Valor Total (R$)</th>
              <th class="border px-2 py-1 sm:px-4 sm:py-2 text-center">Status Projeto</th>
              <th class="border px-2 py-1 sm:px-4 sm:py-2 text-center">Data de Entrega</th>
          </tr>
      </thead>
      <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  sheets.forEach((sheet) => {
      const row = document.createElement("tr");
      row.className = "hover:bg-[#63d487] cursor-pointer";
      row.setAttribute("data-id", sheet.id);

      const editIcon = role === "master"
          ? `<span 
              class="ml-2 text-blue-500 cursor-pointer" 
              title="Editar" 
              onclick="event.stopPropagation(); redirectToEdit(${sheet.id})">
            </span>`
          : "";

      row.innerHTML = `
            <td class="border px-2 py-1 sm:px-4 sm:py-2 flex items-center text-center">
               ${sheet.nomeClient} ${editIcon}
            </td>
            <td class="border px-2 py-1 sm:px-4 sm:py-2 text-center">${sheet.totalValue}</td>
            <td class="border px-2 py-1 sm:px-4 sm:py-2 text-center">
            <span class="flex items-center justify-center">
                <span class="${sheet.projectStatus ? 'bg-green-500' : 'bg-yellow-500'} w-3 h-3 rounded-full mr-2"></span>
                ${sheet.projectStatus ? "Concluído" : "Andamento"}
            </span>
            </td>
            <td class="border px-2 py-1 sm:px-4 sm:py-2 text-center">${sheet.deliveryTime}</td>
      `;

      
      row.addEventListener("click", () => {
          window.location.href = `/src/pages/details.html?id=${sheet.id}`;
      });

      tbody.appendChild(row);
  });

  tableContainer.appendChild(table);
  resultDiv.appendChild(tableContainer);
}



