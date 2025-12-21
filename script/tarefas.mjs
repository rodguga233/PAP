import { database } from "../database/func.mjs";
import { auth, messaging } from "../database/db.mjs"; 

let tbody = null;

// ---- NOTIFICAÇÕES (Firebase 8) ----
async function iniciarNotificacoes() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("O utilizador recusou as notificações");
      return;
    }

    // Registar o service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("Service Worker registado:", registration);

    // Gerar token (Firebase 8)
    const token = await messaging.getToken({
      vapidKey: "BHiILQLqXGVaOA1SeVwWWbLjx9SXt2AH4o_Ut3n3fpG-0KHGKG9jr2Dhh22At596WIfgMUlehcZCW5mrH2W0mLQ",
      serviceWorkerRegistration: registration
    });

    console.log("TOKEN FCM:", token);

    const user = auth.currentUser;
    if (user) {
      await database.updateData(`/tokens/${user.uid}`, { token });
    }

    // Notificações em foreground
    messaging.onMessage((payload) => {
      const { notification } = payload;
      new Notification(notification.title, {
        body: notification.body
      });
    });

  } catch (error) {
    console.error("Erro ao iniciar notificações:", error);
  }
}

// ---- DOM ----
console.clear();
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado com sucesso!!!");

  iniciarNotificacoes();

  // Firebase 8 → auth.onAuthStateChanged
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userID = user.uid;
      console.log("Utilizador autenticado:", userID);

      var utilizador = await database.read(`/users/${userID}/nome`);
      console.log("Nome do utilizador:", utilizador);

      utilizador = "Ola " + utilizador;

      const divNome = document.getElementById("nome");
      divNome.textContent = utilizador;

      const tarefas = await database.read(`/tarefas/${userID}`);
      console.log("Tarefas carregadas:", tarefas);

      if (tarefas) {
        const tabela = document.createElement("table");
        tabela.id = "tabelaTarefas";
        tabela.style.width = "100%";
        tabela.style.marginTop = "20px";
        tabela.style.borderCollapse = "collapse";
        tabela.border = "1";

        const thead = document.createElement("thead");
        thead.style.height = "30px";
        thead.style.backgroundColor = "#A9A9A9";
        thead.style.color = "black";

        const trHead = document.createElement("tr");
        ["ID", "Tarefa", "Categoria", "Descrição", "Estado", "Ações"].forEach(text => {
          const th = document.createElement("th");
          th.textContent = text;
          trHead.appendChild(th);
        });

        thead.appendChild(trHead);
        tabela.appendChild(thead);

        tbody = document.createElement("tbody");
        tbody.style.textAlign = "left";
        tbody.style.height = "25px";
        tbody.style.backgroundColor = "#f2f2f2";

        Object.entries(tarefas).forEach(gerarTabela);
        tabela.appendChild(tbody);

        const divTabela = document.getElementById("tabela");
        divTabela.innerHTML = "";
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

// ---- Tabela ----
function gerarTabela([id, tarefa]) {
  const tr = document.createElement("tr");

  const tdId = document.createElement("td");
  tdId.textContent = id;
  tr.appendChild(tdId);

  const tdTarefa = document.createElement("td");
  tdTarefa.textContent = tarefa.tarefa;
  tr.appendChild(tdTarefa);

  const tdCategoria = document.createElement("td");
  tdCategoria.textContent = tarefa.categoria || "sem categoria";
  tr.appendChild(tdCategoria);

  const tdDescricao = document.createElement("td");
  let descricao_txt = tarefa.descricao;
  if (descricao_txt.length > 35) descricao_txt = descricao_txt.slice(0, 35) + "...";
  tdDescricao.textContent = descricao_txt;
  tr.appendChild(tdDescricao);

  const tdEstado = document.createElement("td");
  tdEstado.textContent = tarefa.estado;
  tr.appendChild(tdEstado);

  const tdAcoes = document.createElement("td");
  tdAcoes.style.textAlign = "center";

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
}
