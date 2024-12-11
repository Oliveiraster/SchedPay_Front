document.getElementById("sheetForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nomeClient = document.getElementById("nomeClient").value;
    const totalValue = document.getElementById("totalValue").value;
    const installments = document.getElementById("installments").value;
    const deliveryTime = document.getElementById("deliveryTime").value;
    const amountPaid = document.getElementById("amountPaid").value;
    const allowedEmails = document.getElementById("allowedEmails").value.split(',');

    
    if (!nomeClient || !totalValue || !installments || !deliveryTime || !amountPaid) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        window.location.href = "/index.html"
        return;
    }

    const sheetData = {
        nomeClient,
        totalValue: parseFloat(totalValue),
        installments: parseInt(installments),
        deliveryTime,
        amountPaid: parseFloat(amountPaid),
        allowedEmails: allowedEmails.map(email => email.trim())
    };
    

    fetch("http://localhost:8080/planningsheets", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sheetData),

    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Erro ao criar sheet. Tente novamente.");
        }
        return response.json();
    })
    .then((data) => {
        alert("Sheet criado com sucesso!");
        window.location.href = "/src/pages/home.html";
    })
    .catch((error) => {
        console.error("Erro:", error);
        alert(`Erro ao criar sheet: ${error.message}`);
    });
});
