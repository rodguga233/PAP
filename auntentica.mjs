import { auth } from "./database/db.mjs"; 
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

console.clear();
document.addEventListener("DOMContentLoaded", () => {
  
  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("Login");

  form.addEventListener("submit", async (event) => {

    event.preventDefault();
    const email = document.getElementById("email");
    const pass = document.getElementById("password");
    
    console.log(" email:", email.value, " pass:", pass.value );
          
      if( form.id === "Login" ){

        console.log("ID do formulário correto.");

        signInWithEmailAndPassword(auth, email.value, pass.value)
        .then( async (userCredential) => {

          setTimeout(() => {
            window.location.href = "tarefas.html";
          }, 500);

        }).catch( (error) => {

          alert("Erro ao logar: " + error.message);

          setTimeout(() => {
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            window.location.reload();
          }, 500);

        });
        
      } else {
        console.log("Nome do formulário incorreto.");
      }

      
  });
});