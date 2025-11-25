import { database } from "./database/func.mjs";
import { auth } from "./database/db.mjs"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { userID } from "./auntentica.mjs";


console.clear();
document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM carregado com sucesso!!!");
    onAuthStateChanged( auth, (user) => {
        if (user) {
            console.log("Utilizador autenticado:", user.uid);
            const userID = user.uid;
        } else {
            alert("Nenhum utilizador autenticado. Redirecionando para a página de login.");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        }
    });


});

