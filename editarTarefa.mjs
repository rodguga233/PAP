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

      }

    } else {
      alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
      setTimeout(() => {
          window.location.href = "index.html";
      }, 500);
    }
  });
});