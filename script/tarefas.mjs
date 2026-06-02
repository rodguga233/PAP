import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { inicializarCriarTarefa } from "./criar-tarefa.mjs";
import { inicializarEditarTarefa } from "./editar-tarefa.mjs";
import { inicializarEliminarTarefa } from "./eliminar-tarefa.mjs";

const todoList = document.getElementById("todo-list");
const doingList = document.getElementById("doing-list");
const doneList = document.getElementById("done-list");

const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const notification = document.getElementById("notification");

window.activeOverlay = null;
window.currentTaskID = null;
window.userID = null;
window.editar = false;

// MOSTRAR NOTIFICAÇÃO
const savedMessage = sessionStorage.getItem("taskMessage");
if (savedMessage) {
  notification.querySelector("p").textContent = savedMessage;
  notification.classList.add("show");

  sessionStorage.removeItem("taskMessage");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// PROFILE DROPDOWN
const profileIcon = document.getElementById("profile-icon");
const dropdown = document.getElementById("profile-dropdown");

profileIcon.addEventListener("click", () => {
  dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("click", (e) => {
  if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

// PERFIL
document.getElementById("edit-profile").addEventListener("click", () => {
  window.location.href = "perfil.html";
});

// SIGN OUT
document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// ABRIR ADD TASK
addTaskCTA.addEventListener("click", () => {
  editar = false;
  document.getElementById("overlay-title").textContent = "Adicionar tarefa";
  document.getElementById("overlay-submit-btn").textContent = "Guardar";
  document.getElementById("form-add").reset();
  document.getElementById("add-status-label").style.display = "none";
  document.getElementById("add-status").style.display = "none";

  setTaskOverlay.classList.remove("hide");
  activeOverlay = setTaskOverlay;
  document.body.classList.add("overflow-hidden");
});

// FECHAR OVERLAYS
closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (window.editar) {
      window.editar = false;
      document.getElementById("overlay-title").textContent = "Adicionar tarefa";
      document.getElementById("overlay-submit-btn").textContent = "Guardar";
      document.getElementById("form-add").reset();
    }

    document.getElementById("add-status-label").style.display = "block";
    document.getElementById("add-status").style.display = "block";

    window.activeOverlay.classList.add("hide");
    window.activeOverlay = null;
    document.body.classList.remove("overflow-hidden");
  });
});

// CRIAR CARD
function criarCard(id, tarefa, destinoLista) {
  const li = document.createElement("li");
  li.className = "task-item";

  // por defeito, todas têm padding
  li.style.paddingLeft = "9px";

  if (tarefa.conclusao !== "Sem data") {
    const dataConclusao = new Date(tarefa.conclusao).getTime();

    if (dataConclusao < Date.now() && tarefa.estado !== "Concluído") {
      li.classList.add("atrasada");
      li.style.paddingLeft = "5px";
    }
  }

  const btn = document.createElement("button");
  btn.className = "task-button";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.width = "100%";
  btn.style.position = "relative";

  const esquerda = document.createElement("div");
  esquerda.style.display = "flex";
  esquerda.style.flexDirection = "column";
  esquerda.style.flex = "1";

  const nome = document.createElement("p");
  nome.className = "task-name";
  nome.style.fontSize = "15px";
  nome.style.fontWeight = "600";
  nome.textContent = tarefa.tarefa;

  const categoria = document.createElement("span");
  categoria.className = "task-category";
  categoria.style.fontSize = "13px";
  categoria.style.color = "#666";
  categoria.style.marginLeft = "6px";
  categoria.textContent =
    tarefa.categoria === "Nenhuma" ? "" : tarefa.categoria;

  const linhaTopo = document.createElement("div");
  linhaTopo.style.display = "flex";
  linhaTopo.style.alignItems = "center";
  linhaTopo.appendChild(nome);
  linhaTopo.appendChild(categoria);

  const prioridade = document.createElement("span");
  prioridade.classList.add("prioridade");
  if (tarefa.prioridade === "Alta") prioridade.classList.add("prioridade-alta");
  if (tarefa.prioridade === "Média") prioridade.classList.add("prioridade-media");
  if (tarefa.prioridade === "Baixa") prioridade.classList.add("prioridade-baixa");
  prioridade.textContent = tarefa.prioridade || "Baixa";

  esquerda.appendChild(linhaTopo);
  esquerda.appendChild(prioridade);

  const data = document.createElement("p");
  data.className = "task-due-date";
  data.style.fontSize = "14px";
  data.style.color = "#333";
  data.style.position = "absolute";
  data.style.left = "50%";
  data.style.transform = "translateX(-50%)";
  data.style.textAlign = "center";
  data.style.width = "max-content";

  data.textContent =
    tarefa.conclusao === "Sem data"
      ? "Sem data"
      : new Date(tarefa.conclusao).toLocaleString("pt-PT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });


  const arrow = document.createElement("iconify-icon");
  arrow.setAttribute("icon", "material-symbols:arrow-forward-ios-rounded");
  arrow.setAttribute("width", "18");
  arrow.setAttribute("height", "18");

  btn.appendChild(esquerda);
  btn.appendChild(data);
  btn.appendChild(arrow);
  li.appendChild(btn);

  btn.addEventListener("click", () => {
    window.currentTaskID = id;
    document.getElementById("view-name").textContent = tarefa.tarefa;
    document.getElementById("view-desc").textContent = tarefa.descricao;
    document.getElementById("view-category").textContent =
      tarefa.categoria === "Nenhuma" ? "Sem categoria" : tarefa.categoria;

    document.getElementById("view-date").textContent =
      tarefa.conclusao === "Sem data"
        ? "Sem data"
        : new Date(tarefa.conclusao).toLocaleString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

    document.getElementById("view-status").textContent = tarefa.estado;
    document.getElementById("view-prioridade").textContent = tarefa.prioridade;

    viewTaskOverlay.classList.remove("hide");
    window.activeOverlay = viewTaskOverlay;
    document.body.classList.add("overflow-hidden");
  });

  destinoLista.appendChild(li);
}

// MENSAGEM 
function mostrarMensagemVazia(destinoLista, nomeCategoria) {
  const msg = document.createElement("li");
  msg.className = "task-item";
  msg.style.textAlign = "center";
  msg.style.color = "#777";
  msg.style.padding = "5px";
  msg.style.fontStyle = "italic";
  msg.textContent = `Sem tarefas em "${nomeCategoria}"`;
  destinoLista.appendChild(msg);
}

// CARREGAR TAREFAS
onAuthStateChanged(auth, async user => {
  if (!user) return (window.location.href = "index.html");

  window.userID = user.uid;

  const userData = await database.read(`/users/${window.userID}`);

  const profileIcon = document.getElementById("profile-icon");
  const userName = document.getElementById("user-name");

  userName.textContent = userData?.nome || "Utilizador";

  if (userData?.fotoPerfil && userData.fotoPerfil !== "Nenhuma") {
    profileIcon.src = userData.fotoPerfil;
  } else {
    profileIcon.src = "img/perfil.jpg";
  }

  // Inicializar módulos de criar, editar e eliminar tarefas
  inicializarCriarTarefa(window.userID);
  inicializarEditarTarefa(window.userID);
  inicializarEliminarTarefa(window.userID);

  // CARREGAR TAREFAS
  const tarefas = await database.read(`/tarefas/${window.userID}`);

  let pendenteCount = 0;
  let progressoCount = 0;
  let concluidoCount = 0;

  if (tarefas) {
    const ordenadas = ordenarTarefas(tarefas);

    ordenadas.forEach(([id, tarefa]) => {
      switch (tarefa.estado) {
        case "Pendente":
          criarCard(id, tarefa, todoList);
          pendenteCount++;
          break;

        case "Em progresso":
          criarCard(id, tarefa, doingList);
          progressoCount++;
          break;

        case "Concluído":
          criarCard(id, tarefa, doneList);
          concluidoCount++;
          break;
      }
    });
  }

  if (pendenteCount === 0) mostrarMensagemVazia(todoList, "Pendente");
  if (progressoCount === 0) mostrarMensagemVazia(doingList, "Em progresso");
  if (concluidoCount === 0) mostrarMensagemVazia(doneList, "Concluído");

  document.getElementById("count-pendente").textContent = pendenteCount;
  document.getElementById("count-progresso").textContent = progressoCount;
  document.getElementById("count-concluido").textContent = concluidoCount;
});

// FILTRO
const filterBtn = document.getElementById("filter-btn");
const filterMenu = document.getElementById("filter-menu");

filterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterMenu.classList.toggle("hide");
});

document.addEventListener("click", (e) => {
  if (!filterBtn.contains(e.target) && !filterMenu.contains(e.target)) {
    filterMenu.classList.add("hide");
  }
});

document.querySelectorAll("#filter-menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    filterMenu.classList.add("hide");
  });
});

// ORDENAR TAREFAS
function ordenarTarefas(tarefasObj) {
  const prioridadePeso = { "Alta": 1, "Média": 2, "Baixa": 3 };

  return Object.entries(tarefasObj).sort((a, b) => {
    const tarefaA = a[1];
    const tarefaB = b[1];

    const dataA = tarefaA.conclusao === "Sem data"
      ? Infinity
      : new Date(tarefaA.conclusao).getTime();

    const dataB = tarefaB.conclusao === "Sem data"
      ? Infinity
      : new Date(tarefaB.conclusao).getTime();

    const agora = Date.now();
    const atrasadaA = dataA < agora;
    const atrasadaB = dataB < agora;

    if (atrasadaA && !atrasadaB) return -1;
    if (!atrasadaA && atrasadaB) return 1;

    if (atrasadaA && atrasadaB) {
      const diffPrioridade = prioridadePeso[tarefaA.prioridade] - prioridadePeso[tarefaB.prioridade];
      if (diffPrioridade !== 0) return diffPrioridade;
      return dataA - dataB;
    }

    const diffPrioridade = prioridadePeso[tarefaA.prioridade] - prioridadePeso[tarefaB.prioridade];
    if (diffPrioridade !== 0) return diffPrioridade;

    return dataA - dataB;
  });
}
