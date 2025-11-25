import { database } from "./database/func.mjs";
import { auth } from "./database/db.mjs"; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


console.clear();
document.addEventListener("DOMContentLoaded", () => {
  
  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("criarConta");

  form.addEventListener("submit", async (event) => {

    event.preventDefault();
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const pass = document.getElementById("password");
    const agora = new Date();
    
    console.log("nome:", nome.value, " email:", email.value, " pass:", pass.value );
          
      if( form.id === "criarConta" ){

        console.log("ID do formulário correto.");

        createUserWithEmailAndPassword(auth, email.value, pass.value)
        .then( async (userCredential) => {

          alert("Utilizador criado com sucesso!");

          const userID = userCredential.user.uid;
          const query = await database.write("/users/" + userID,
            {
              userID: userID,
              nome: nome.value,
              email: email.value,
              pass: pass.value,
              Criado_em: agora.toLocaleString("pt-PT")
            }
          );
        
          const no = "/users/" + query;
          console.log("Nó criado:", no);

          setTimeout(() => {
            window.location.href = "index.html";
          }, 500);
      
        }).catch( (error) => {

          alert("Erro ao criar o utilizador: " + error.message);

          setTimeout(() => {
            document.getElementById("nome").value = "";
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

