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

      // ✅ Lê apenas as tarefas do utilizador autenticado
      const tarefas = await database.read(`/tarefas/${userID}`);
      console.log("Tarefas carregadas:", tarefas);

      // Referência ao tbody da tabela
      const tbody = document.querySelector("#tabelaTarefas tbody");
      tbody.innerHTML = ""; // limpa antes de preencher

      if (tarefas) {
        Object.entries(tarefas).forEach(([id, tarefa]) => {
            const tr = document.createElement("tr");

            // Coluna ID (vai mostrar "conteudo")
            const tdId = document.createElement("td");
            tdId.textContent = id;
            tr.appendChild(tdId);

            // Coluna conteúdo (vai mostrar "Teste para ler a mensagem")
            const tdConteudo = document.createElement("td");
            tdConteudo.textContent = tarefa || "(sem conteúdo)";
            tr.appendChild(tdConteudo);

            // Coluna estado (só se existir)
            const tdEstado = document.createElement("td");
            tdEstado.textContent = tarefa.feito ? "Concluída" : "Pendente";
            tr.appendChild(tdEstado);

            tbody.appendChild(tr);
        });
      } else {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.textContent = "Nenhuma tarefa encontrada.";
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    } else {
      alert("Nenhum utilizador autenticado. Redirecionando para a página de login.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  });
});
