import { database } from "./database/func.mjs";

document.addEventListener("DOMContentLoaded", () => {
  
  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("FormUser");

  form.addEventListener("submit", async (event) => {

    event.preventDefault();
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const pass = document.getElementById("password");
    // const agora = new Date();

    alert(nome.value + " " + email.value + " " + pass.value );

      const before = Date.now();
      const data = await database.read("/ping");
      const after = Date.now();
      const ping = after - before;
            
      console.log("Sucesso ao logar na firebase!");

      if( data ) console.log(`${data} ${ping}ms`); else console.log("Dado não existente");
          
      if( form.id === "FormUser" ){

        console.log("Nome do formulário correto.");

        // const query = await database.addData("/users",
        //   {
        //     nome: nome.value;
        //     email: email.value;
        //     pass: pass.value;
        //     Criado_em: agora.toLocaleString("pt-PT")
        //   }
        // );
        // 
        // const no = "/users/" + query;
        // console.log("Nó criado:", no);

      } else {
        console.log("Nome do formulário incorreto.");
      }
          
      // await database.listen(no, (dados) => {
      //   console.log("Dados atualizados:", dados);
      // });
  });
});

