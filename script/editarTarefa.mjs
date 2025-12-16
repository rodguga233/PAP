import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

console.clear();
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado com sucesso!!!");
  let form = document.getElementById("editarTarefa");
  let id;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userID = user.uid;
      console.log("Utilizador autenticado:", userID);

      //pegar o id atraves dos parametros no URL
      const params = new URLSearchParams(window.location.search);
      id = params.get("idTarefa");

      if(id){
        sessionStorage.setItem("idTarefa", id);
      } else {
        id = sessionStorage.getItem("idTarefa");
      }

      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("ID da tarefa:", id);

      const tarefa = await database.read(`/tarefas/${userID}/${id}`);
      console.log("Tarefa carregada:", tarefa);

      if (tarefa) {
        document.getElementById("tarefa").value = tarefa.tarefa;
        document.getElementById("categoria").value = tarefa.categoria;
        document.getElementById("descricao").value = tarefa.descricao;
        
        //adicionar uma checkbox 
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox";
        if(tarefa.estado === "Concluída"){
          checkbox.checked = true;
        }
        const marcarEstado = document.getElementById("marcarEstado");
        marcarEstado.innerHTML = "Marcar como concluído:";
        marcarEstado.appendChild(checkbox);

        form.addEventListener("submit", async (event) => {

          event.preventDefault();
          const tarefaVal = document.getElementById("tarefa").value;
          const categoriaVal = document.getElementById("categoria").value;
          const descricaoVal = document.getElementById("descricao").value;
          const checkboxVal = document.getElementById("checkbox");

          const estadoVal = checkboxVal.checked ? "Concluído" : "Pendente";

          try{

            await database.updateData(`/tarefas/${userID}/${id}`, { 
              estado: estadoVal, 
              tarefa: tarefaVal,
              categoria: categoriaVal,
              descricao: descricaoVal
            });
            alert("Tarefa atualizada!");
            window.location.href = "tarefas.html";

          } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            alert("Não foi possível atualizar a tarefa.");
          }
        });
      }
    } else {
      alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
      setTimeout(() => {
          window.location.href = "index.html";
      }, 500);
    }
  });
});