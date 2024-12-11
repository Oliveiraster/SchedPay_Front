const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", () => {
    window.history.back();
});

function populateForm(sheetData) {
    document.getElementById("nomeClient").value = sheetData.nomeClient || "";
    document.getElementById("totalValue").value = sheetData.totalValue || "";
    document.getElementById("installments").value = sheetData.installments || "";
    document.getElementById("deliveryTime").value = sheetData.deliveryTime || "";
    document.getElementById("amountPaid").value = sheetData.amountPaid || "";
    document.getElementById("allowedEmails").value = (sheetData.allowedEmails || []).join(", ");
    
    const statusButton = document.getElementById("statusButton");
    const statusText = document.getElementById("statusText");
    const projectStatus = sheetData.projectStatus || false;

    statusButton.classList.toggle("bg-green-500", projectStatus);
    statusButton.classList.toggle("bg-red-500", !projectStatus);
    statusText.textContent = projectStatus ? "Projeto Concluído" : "Marcar como Concluído";
    statusButton.dataset.status = projectStatus; 
}

function fetchSheetData() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "/index.html";
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("id");

    fetch(`http://localhost:8080/planningsheets/${itemId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar dados da sheet.");
            }
            return response.json();
        })
        .then((data) => {
            populateForm(data);
        })
        .catch((error) => {
            console.error("Erro ao buscar dados:", error);
            alert("Erro ao buscar os dados da sheet. Tente novamente mais tarde.");
            window.location.href = "/index.html";
        });
}

window.addEventListener("DOMContentLoaded", fetchSheetData);

document.getElementById("statusButton").addEventListener("click", function () {
    const statusButton = document.getElementById("statusButton");
    const statusText = document.getElementById("statusText");
    let projectStatus = statusButton.classList.contains("bg-green-500");

    projectStatus = !projectStatus;

    statusButton.classList.toggle("bg-green-500", projectStatus);
    statusButton.classList.toggle("bg-red-500", !projectStatus);
    statusText.textContent = projectStatus ? "Projeto Concluído" : "Marcar como Concluído";

    statusButton.dataset.status = projectStatus; 
});

document.getElementById("sheetForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const itemId = params.get("id");

    const nomeClient = document.getElementById("nomeClient").value;
    const totalValue = document.getElementById("totalValue").value;
    const installments = document.getElementById("installments").value;
    const deliveryTime = document.getElementById("deliveryTime").value;
    const amountPaid = document.getElementById("amountPaid").value;
    const allowedEmails = document.getElementById("allowedEmails").value.split(",").map(email => email.trim());
    const projectStatus = document.getElementById("statusButton").dataset.status === "true"; 

    if (!nomeClient || !totalValue || !installments || !deliveryTime || !amountPaid) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "/index.html";
        return;
    }

    const sheetData = {
        nomeClient,
        totalValue: parseFloat(totalValue),
        installments: parseInt(installments),
        deliveryTime,
        amountPaid: parseFloat(amountPaid),
        projectStatus, 
        allowedEmails
    };

    fetch(`http://localhost:8080/planningsheets/${itemId}`, {
        method: "PUT", 
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sheetData)
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao salvar sheet. Tente novamente.");
            }
            return response.json();
        })
        .then((data) => {
            alert("Sheet salvo com sucesso!");
            window.location.href = "/src/pages/home.html";
        })
        .catch((error) => {
            console.error("Erro:", error);
            alert(`Erro ao salvar sheet: ${error.message}`);
        });
});
