function checkRole() {
  const token = localStorage.getItem("authToken");
  if (!token) {
      console.log("Token não encontrado.");
      return null;
  }

  const decodedToken = parseJwt(token);
  return decodedToken ? decodedToken.role : null;
}

function parseJwt(token) {
  try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
  } catch (error) {
      console.error("Erro ao decodificar o token", error);
      return null;
  }
}

export { checkRole };