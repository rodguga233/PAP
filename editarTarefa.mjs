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

      const params = new URLSearchParams(window.location.search);

      const id = params.get("idTarefa");
      console.log("ID:", id);

      const tarefa = await database.read(`/tarefas/${userID}/${id}`);
      console.log("Tarefa carregada:", tarefa);

      if (tarefa) {

        document.getElementById("tarefa").value = tarefa.tarefa;
        document.getElementById("categoria").value = tarefa.categoria;
        document.getElementById("descricao").value = tarefa.descricao;

        if(tarefa.estado === "Pendente"){
          const botaoEstado = document.createElement("button");
          botaoEstado.type = "button";
          botaoEstado.textContent = "Marcar como concluido";
          botaoEstado.style.marginTop = "20px";
          botaoEstado.style.backgroundColor = "#2D9B27";

          //mudar o estado da tarefa para concluida
          botaoEstado.addEventListener('click', async () =>{
            try {
              await database.updateData(`/tarefas/${userID}/${id}`, { estado: "Concluída" });
              alert("Tarefa atualizada para concluída!");
              window.location.href = "tarefas.html";

            } catch (error) {
              console.error("Erro ao atualizar tarefa:", error);
              alert("Não foi possível atualizar a tarefa.");
            }
          });

          const divBotao = document.getElementById("marcarEstado");
          divBotao.innerHTML = "";
          divBotao.appendChild(botaoEstado);
        }
      }

    } else {
      alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
      setTimeout(() => {
          window.location.href = "index.html";
      }, 500);
    }
  });
});