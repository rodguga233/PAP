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
        thead.style.height = "30px";
        thead.style.backgroundColor = "#A9A9A9";
        thead.style.color = "black";

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

        const thHead6 = document.createElement("th");
        thHead6.textContent = "Ações";

        trHead.appendChild(thHead1);
        trHead.appendChild(thHead2);
        trHead.appendChild(thHead3);
        trHead.appendChild(thHead4);
        trHead.appendChild(thHead5);
        trHead.appendChild(thHead6);

        thead.appendChild(trHead);
        tabela.appendChild(thead);


        tbody = document.createElement("tbody");
        tbody.style.textAlign = "left";
        tbody.style.height = "25px";
        tbody.style.backgroundColor = "#f2f2f2";

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
  tdTarefa.textContent = tarefa.tarefa;
  tr.appendChild(tdTarefa);

  // coluna do categoria
  const tdCategoria = document.createElement("td");
  tdCategoria.textContent = tarefa.categoria || "sem categoria";
  tr.appendChild(tdCategoria);

  // coluna do conteudo
  const tdDescricao = document.createElement("td");
  let descricao_txt = tarefa.descricao;
  if (descricao_txt.length > 35) { 
    descricao_txt = descricao_txt.slice(0, 35) + "...";
  }
  tdDescricao.textContent = descricao_txt;
  tr.appendChild(tdDescricao);

  // coluna do estado
  const tdEstado = document.createElement("td");
  tdEstado.textContent = tarefa.estado;
  tr.appendChild(tdEstado);

  //Coluna de ações (editar)
  const tdAcoes = document.createElement("td");
  tdAcoes.style.textAlign = "center";

  //fazer o botao e a funcao de abrir a pagina com o id da tarefa
  const botaoEditar = document.createElement("button");
  botaoEditar.style.border = "1px solid black";
  botaoEditar.style.backgroundColor = "#3457D5";
  botaoEditar.textContent = "Editar";
  botaoEditar.style.color = "white";

  botaoEditar.addEventListener("click", () => {
    window.location.href = `editarTarefa.html?idTarefa=${id}`;
  });

  const botaoApagar = document.createElement("button");
  botaoApagar.style.border = "1px solid black";
  botaoApagar.style.backgroundColor = "#ed0e0eff";
  botaoApagar.textContent = "X";
  botaoApagar.style.color = "white";
  botaoApagar.style.marginLeft = "10px";

  botaoApagar.addEventListener("click", () => {
    window.location.href = `apagartarefa.html?idTarefa=${id}`;
  });

  tdAcoes.appendChild(botaoEditar);
  tdAcoes.appendChild(botaoApagar);
  tr.appendChild(tdAcoes);

  tbody.appendChild(tr);
};