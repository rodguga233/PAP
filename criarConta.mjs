import { database } from "./database/func.mjs";
import { auth } from "./database/db.mjs"; 
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


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
            Criado_em: agora.toLocaleString("pt-PT")
          }
        );
        
        const no = "/users/" + query;
        console.log("Nó criado:", no);

        setTimeout(() => {
          window.location.href = "index.html";
        }, 500);
      
      }).catch( (error) => {
        console.error("Erro ao criar utilizador:", error)

        if (error.code === 'auth/email-already-in-use')
          alert("O email ja esta a ser utilizador. Por favor, introduza outro email.");

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

