import { auth } from "./database/db.mjs"; 

console.clear();
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("Login");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    console.log("email:", email, "pass:", pass);

    if (form.id === "Login") {

      console.log("ID do formulário correto.");

      // Firebase 8 → auth.signInWithEmailAndPassword
      auth.signInWithEmailAndPassword(email, pass)
        .then(() => {

          setTimeout(() => {
            window.location.href = "tarefas.html";
          }, 500);

        })
        .catch((error) => {

          console.error("Erro ao autenticar:", error);

          if (error.code === "auth/invalid-credential") {
            alert("Credenciais inválidas. Por favor, verifique o email e a password.");
          }

          setTimeout(() => {
            window.location.reload();
          }, 500);
        });

    } else {
      console.log("Nome do formulário incorreto.");
    }
  });
});
