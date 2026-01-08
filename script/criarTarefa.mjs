import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs"; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

console.clear();
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("criarConta");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password1").value;
    const agora = new Date();

    if (form.id === "criarConta") {

      console.log("ID do formulário correto.");

      // Firebase 11 → createUserWithEmailAndPassword(auth, email, pass)
      createUserWithEmailAndPassword(auth, email, pass)
        .then(async (userCredential) => {

          alert("Utilizador criado com sucesso!");

          const userID = userCredential.user.uid;

          await database.write(`/users/${userID}`, {
            userID: userID,
            nome: nome,
            email: email,
            Criado_em: agora.toLocaleString("pt-PT"),
            notificacoes: false,
          });

          console.log("Nó criado:", `/users/${userID}`);

          setTimeout(() => {
            window.location.href = "index.html";
          }, 500);

        })
        .catch((error) => {
          console.error("Erro ao criar utilizador:", error);

          if (error.code === "auth/email-already-in-use") {
            alert("O email já está a ser utilizado.");
          }

          setTimeout(() => {
            alert("Erro ao criar o utilizador: " + error.message);
            window.location.reload();
          }, 5000);
        });

    } else {
      console.log("Nome do formulário incorreto.");
    }
  });
});
