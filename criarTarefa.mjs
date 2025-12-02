import { database } from "./database/func.mjs";
import { auth } from "./database/db.mjs"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


console.clear();
document.addEventListener("DOMContentLoaded", () => {
  
  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("criarTarefa");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
        const userID = user.uid;
        console.log("Utilizador autenticado:", userID);

            form.addEventListener("submit", async (event) => {

                event.preventDefault();
                const titulo = document.getElementById("titulo");
                const categoria = document.getElementById("categoria");
                const tarefa = document.getElementById("tarefaword");
                const agora = new Date();
                
                console.log("titulo:", titulo.value, " categoria:", categoria.value, " tarefa:", tarefa.value );
                    
                if( form.id === "criarTarefa" ){

                    console.log("ID do formulário correto.");

                    const query = await database.write("/tarefas/" + userID,{
                        titulo: titulo.value,
                        categoria: categoria.value,
                        tarefa: tarefa.value,
                        estado: "Pendente",
                        criado_em: agora.toLocaleString("pt-PT")
                    });

                    const no = "/tarefas/" + userID + "/" + query;
                    console.log("Nó criado:", no);

                } else {
                    console.log("Nome do formulário incorreto.");
                }
            });
        } else {
            alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        }
    });
});