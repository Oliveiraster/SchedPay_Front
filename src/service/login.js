
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.getElementById("userType").value;
  
    const endpoint =
      userType === "master"
        ? "http://localhost:8080/user/login"
        : "http://localhost:8080/client/login";
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } 
        if (!response.ok) {
          const errorData = response.json();
          const errorMessage = errorData.password || "Verifique suas credenciais!";
          throw new Error(errorMessage);
      }})
      .then((data) => {
        console.log(data.token); 
        
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        
          statusMessage.classList.add("bg-green-500");
          statusMessage.classList.remove("hidden");
          statusMessage.textContent = "Login feito com sucesso !"
          setTimeout(() => {
            statusMessage.classList.add("hidden");
            statusMessage.classList.remove("bg-green-500");
            window.location.href = "/src/pages/planningsheet.html";
          }, 500); 
    
          
        } else {
          throw new Error("Token não encontrado na resposta.");
        }
      })
      .catch((error) => {
        statusMessage.textContent =
        error.message.includes("Failed to fetch")
          ? "O servidor está temporariamente fora do ar. Por favor, tente novamente mais tarde."
          : error.message;
          statusMessage.classList.add("bg-red-500");
          statusMessage.classList.remove("hidden");
      setTimeout(() => {
        statusMessage.classList.add("hidden");
        statusMessage.classList.remove("bg-red-500");
      }, 10000); 
      });
    
  });
  