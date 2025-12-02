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
        thHead2.textContent = "Tarefa";

        const thHead3 = document.createElement("th");
        thHead3.textContent = "Categoria";

        const thHead4 = document.createElement("th");
        thHead4.textContent = "Descrição";

        const thHead5 = document.createElement("th");
        thHead5.textContent = "Estado";

        trHead.appendChild(thHead1);
        trHead.appendChild(thHead2);
        trHead.appendChild(thHead3);
        trHead.appendChild(thHead4);
        trHead.appendChild(thHead5);

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
        const divTabela = document.getElementById("tabela");
        divTabela.innerHTML = "";

        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhuma tarefa encontrada";
        mensagem.style.textAlign = "center";
        mensagem.style.fontWeight = "bold";
        mensagem.style.marginTop = "20px";
        mensagem.style.fontSize = "18px";

        divTabela.appendChild(mensagem);
      }
    } else {
      alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  });
});
function gerarTabela([id, tarefa]) {
  const tr = document.createElement("tr");

  // coluna do ID 
  const tdId = document.createElement("td");
  tdId.textContent = id;
  tr.appendChild(tdId);

  // coluna do titulo
  const tdTarefa = document.createElement("td");
  tdTarefa.textContent = tarefa.tarefa || "sem título";
  tr.appendChild(tdTarefa);

  // coluna do categoria
  const tdCategoria = document.createElement("td");
  tdCategoria.textContent = tarefa.categoria || "sem categoria";
  tr.appendChild(tdCategoria);

  // coluna do conteudo
  const tdDescricao = document.createElement("td");
  tdDescricao.textContent = tarefa.descricao || "sem conteudo";
  tr.appendChild(tdDescricao);

  // coluna do estado
  const tdEstado = document.createElement("td");
  tdEstado.textContent = tarefa.estado || "Pendente";
  tr.appendChild(tdEstado);

  tbody.appendChild(tr);
};