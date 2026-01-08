import { auth } from "./database/db.mjs";
import { onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

console.clear();

document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("Login");

  // Login automático se a sessão ainda estiver ativa
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Sessão ainda ativa. Redirecionando...");
      window.location.href = "tarefas.html";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    console.log("email:", email, "pass:", pass);

    if (form.id === "Login") {

      console.log("ID do formulário correto.");

      signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
          setTimeout(() => {
            window.location.href = "tarefas.html";
          }, 500);
        })
        .catch((error) => {
          console.error("Erro ao autenticar:", error.code);
          
          if (error.code === "auth/invalid-credential"){
            alert("Credenciais inválidas!!! Verifique o email e a password.");
          }

          document.getElementById("password").value = "";
          console.clear();
        });

    } else {
      console.log("Nome do formulário incorreto.");
    }
  });
});
