import { database } from "./database/func.mjs";
import { auth } from "./database/db.mjs"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
console.clear();
document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM carregado com sucesso!!!");
    onAuthStateChanged( auth, (user) => {
        if (user) {
            console.log("Utilizador autenticado:", user.uid);
            const userID = user.uid;
            
            console.log("userID obtido com sucesso: " + userID );
            console.log("A carregar tarefas...");

            // Aqui podes adicionar o código para carregar e mostrar as tarefas do utilizador
        } else {
            alert("Nenhum utilizador autenticado. Redirecionando para a página de login.");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        }
    });
});

