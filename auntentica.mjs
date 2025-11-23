import { database } from "./database/func.mjs";
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

      const before = Date.now();
      const data = await database.read("/ping");
      const after = Date.now();
      const ping = after - before;
            
      console.log("Sucesso ao logar na firebase!");

      if( data ) console.log(`${data} ${ping}ms`); else console.log("Dado não existente");
          
      if( form.id === "Login" ){

        console.log("ID do formulário correto.");

        signInWithEmailAndPassword(auth, email.value, pass.value);//falta acabar o codigo de autenticação
        
      } else {
        console.log("Nome do formulário incorreto.");
      }

      setTimeout(() => {
        window.location.href = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nationalgeographic.pt%2Fmeio-ambiente%2Fmacacos-negros-entre-iguaria-e-animais-estimacao-na-indonesia_1231&psig=AOvVaw0lUgjgXPsAvl1oP9lZRJ09&ust=1764021121198000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIjj-_OgiZEDFQAAAAAdAAAAABAE";
      }, 3000);
  });
});