import { checkRole } from '../utils/checkRole.js';

window.onload = fetchPlanningSheetDetails;

function fetchPlanningSheetDetails() {
    const detailsContainer = document.getElementById("details");
    const backBtn = document.getElementById("back-btn");

    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("id");

    if (!itemId) {
        detailsContainer.innerHTML = `<p class="text-red-500">ID do item não encontrado. Retorne à página anterior.</p>`;
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        detailsContainer.innerHTML = `<p class="text-red-500">Token não encontrado. Faça login novamente.</p>`;
        return;
    }

    fetch(`http://localhost:8080/planningsheets/${itemId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
        .then((response) => {
            if (!response.ok) {
                window.location.href = "/index.html";
                throw new Error("Erro ao carregar os detalhes. Verifique sua conexão.");
            }
            
            return response.json();
        })
        .then((data) => {
            const role = checkRole();
            console.log(data)
            displayDetails(data, role);
        })
        .catch((error) => {
            console.error("Erro:", error);
            detailsContainer.innerHTML = `<p class="text-red-500">Erro ao carregar detalhes: ${error.message}</p>`;
        });

    backBtn.addEventListener("click", () => {
        window.history.back();
    });
}

function displayDetails(sheet, role) {
    const detailsContainer = document.getElementById("details");

    detailsContainer.innerHTML = `
        <div class="p-4 bg-white rounded shadow-md">
            <h1 class="text-3xl font-bold text-center text-blue-600 mb-4">${sheet.nomeClient}</h1>
            <div class="space-y-2">
                <p><strong>Valor Total:</strong> R$ ${sheet.totalValue}</p>
                <p><strong>Parcelas:</strong> ${sheet.installments}</p>
                <p>
                    <strong>Status do Projeto:</strong>
                    <span class="flex items-center">
                        <span class="${sheet.projectStatus ? 'bg-green-500' : 'bg-yellow-500'} w-3 h-3 rounded-full mr-2"></span>
                        ${sheet.projectStatus ? "Concluído" : "Em Andamento"}
                    </span>
                </p>
                <p><strong>Data de Entrega:</strong> ${sheet.deliveryTime}</p>
                <p><strong>Valor Pago:</strong> ${sheet.amountPaid} / ${sheet.totalValue}</p>
                <p><strong>Valor de parcelas:</strong> ${sheet.installmentsValue.toFixed(2).replace('.', ',')}</p>
                <p><strong>Autor:</strong> ${sheet.author}</p>
                </div>
        </div>
    `;

    if (role === "master") {
        const container = document.getElementById("btn");
    
    
        const editBtn = document.createElement("button");
        editBtn.id = "edit-btn";
        editBtn.textContent = "Editar";
        editBtn.className = "px-4 py-2 bg-yellow-900 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-200";
        editBtn.addEventListener("click", () => {
            const params = new URLSearchParams(window.location.search);
            const itemId = params.get("id");
            window.location.href = `/src/pages/editsheet.html?id=${itemId}`;
        });
    
        const deleteBtn = document.createElement("button");

        deleteBtn.id = "delete-btn";
        deleteBtn.textContent = "Deletar";
        deleteBtn.className = "px-4 py-2 bg-red-900 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200";
        deleteBtn.addEventListener("click", () => {
            const params = new URLSearchParams(window.location.search);
            const itemId = params.get("id");
            const token = localStorage.getItem("authToken");

            if (confirm("Tem certeza que deseja excluir este item?")) {
                fetch(`http://localhost:8080/planningsheets/${itemId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }).then((response) => {
                    if (!response.ok) {
                        window.location.href = "/index.html";
                        throw new Error("Erro ao carregar os detalhes. Verifique sua conexão.");
                    }
                    window.location.href = "/src/pages/home.html"
                    return response.json();
            })

                console.log(`Excluindo item com ID: ${item.id}`);
           
        }});
    
        container.appendChild(editBtn);
        container.appendChild(deleteBtn);
    }
}
