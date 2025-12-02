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
                const tarefa = document.getElementById("tarefa");
                //verificar se a tarefa esta vazio
                if (!tarefa.value.trim()) {
                    alert("Por favor, insira uma tarefa válida.");
                    return;
                }

                const descricao = document.getElementById("descricao");
                //verificar se a descricao esta vazia
                if (!descricao.value.trim()) {
                    descricao.value = "Sem descrição";
                }

                const categoria = document.getElementById("categoria");
                let categoriaValor = categoria.value.trim();

                // Se não houver categoria escolhida, força "Sem categoria"
                if (!categoriaValor || categoriaValor === "null") {
                categoriaValor = "Sem categoria";
                }

                const agora = new Date();
                
                console.log("tarefa:", tarefa.value, " categoria:", categoria.value, " descricao:", descricao.value );
                    
                if( form.id === "criarTarefa" ){

                    console.log("ID do formulário correto.");

                    const query = await database.addData("/tarefas/" + userID,{
                        tarefa: tarefa.value,
                        categoria: categoriaValor,
                        descricao: descricao.value,
                        estado: "Pendente",
                        criado_em: agora.toLocaleString("pt-PT")
                    });

                    const no = "/tarefas/" + userID + "/" + query;
                    console.log("Nó criado:", no);

                    alert("Tarefa criada com sucesso!");

                    setTimeout(() => {
                        window.location.href = "tarefas.html";
                    }, 500);

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