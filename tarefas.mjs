import { database } from "./database/func.mjs";
import { auth } from "./database/db.mjs"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

let tbody = null;// variavel global da tabela 

console.clear();
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado com sucesso!!!");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userID = user.uid;
      console.log("Utilizador autenticado:", userID);

      const tarefas = await database.read(`/tarefas/${userID}`);
      console.log("Tarefas carregadas:", tarefas);

      
    

      if (tarefas) {

        //criar a tabela e adicinar os estilos em javascript
        const tabela = document.createElement("table");
        tabela.id = "tabelaTarefas";
        tabela.style.width = "100%";
        tabela.style.marginTop = "20px";
        tabela.style.borderCollapse = "collapse";
        tabela.border = "1";
        
        //criar o cabeçalho da tabela
        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");

        const thHead1 = document.createElement("th");
        thHead1.textContent = "ID";

        const thHead2 = document.createElement("th");
        thHead2.textContent = "Conteúdo";

        const thHead3 = document.createElement("th");
        thHead3.textContent = "Estado";

        trHead.appendChild(thHead1);
        trHead.appendChild(thHead2);
        trHead.appendChild(thHead3);
        thead.appendChild(trHead);
        tabela.appendChild(thead);


        tbody = document.createElement("tbody");

        Object.entries(tarefas).forEach(gerarTabela);
        tabela.appendChild(tbody);

        // adicionar o corpo à tabela
        const divTabela = document.getElementById("tabela");
        divTabela.innerHTML = ""; // limpa a div para evitar problemas de duplicar a tabela
        divTabela.appendChild(tabela);
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
function gerarTabela([id, tarefa]) {
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
};