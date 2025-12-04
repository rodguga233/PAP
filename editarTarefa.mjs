import { database } from "./database/func.mjs";
import { auth } from "./database/db.mjs"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

console.clear();
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado com sucesso!!!");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userID = user.uid;
        console.log("Utilizador autenticado:", userID);

        console.log("1");
        console.log("2");
        console.log("3");

        const params = new URLSearchParams(window.location.search);
        console.log("parametros:", params);

        const id = params.get("id");
        console.log("ID:", id);

    } else {
        alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    }
  });
});