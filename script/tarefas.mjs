import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// ELEMENTOS
const todoList = document.getElementById("todo-list");     // Pendente
const doingList = document.getElementById("doing-list");   // Em progresso
const doneList = document.getElementById("done-list");     // Concluído

const addTaskCTA = document.getElementById("add-task-cta");
const setTaskOverlay = document.getElementById("set-task-overlay");
const viewTaskOverlay = document.getElementById("view-task-overlay");
const closeButtons = document.querySelectorAll(".close-button");
const notification = document.getElementById("notification");

let activeOverlay = null;
let currentTaskID = null;
let userID = null;

// SIGN OUT
document.querySelector(".sign-out-cta").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// ABRIR ADD TASK
addTaskCTA.addEventListener("click", () => {
  setTaskOverlay.classList.remove("hide");
  activeOverlay = setTaskOverlay;
  document.body.classList.add("overflow-hidden");
});

// FECHAR OVERLAYS
closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    activeOverlay.classList.add("hide");
    activeOverlay = null;
    document.body.classList.remove("overflow-hidden");
  });
});

// CRIAR CARD DE TAREFA
function criarCard(id, tarefa, destinoLista) {
  const li = document.createElement("li");
  li.className = "task-item";

  const btn = document.createElement("button");
  btn.className = "task-button";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.width = "100%";
  btn.style.position = "relative"; // importante para centrar a data

  // ESQUERDA → tarefa (categoria)
  const esquerda = document.createElement("div");
  esquerda.style.display = "flex";
  esquerda.style.flexDirection = "column";
  esquerda.style.textAlign = "left";
  esquerda.style.flex = "1";

  const nome = document.createElement("p");
  nome.className = "task-name";
  nome.style.fontSize = "15px";
  nome.style.fontWeight = "600";
  nome.textContent = tarefa.tarefa;

  const categoria = document.createElement("p");
  categoria.className = "task-category";
  categoria.style.fontSize = "13px";
  categoria.style.color = "#666";
  categoria.textContent = tarefa.categoria ? `(${tarefa.categoria})` : "(Sem categoria)";

  esquerda.appendChild(nome);
  esquerda.appendChild(categoria);

  // CENTRO → data (verdadeiramente ao centro)
  const data = document.createElement("p");
  data.className = "task-due-date";
  data.style.position = "absolute";
  data.style.left = "50%";
  data.style.transform = "translateX(-50%)";
  data.style.fontSize = "14px";
  data.style.color = "#333";
  data.textContent = tarefa.lembrar === "Sem lembrete"
    ? "Sem data"
    : new Date(tarefa.lembrar).toLocaleDateString("pt-PT");

  // DIREITA → seta
  const arrow = document.createElement("iconify-icon");
  arrow.setAttribute("icon", "material-symbols:arrow-back-ios-rounded");
  arrow.setAttribute("width", "18");
  arrow.setAttribute("height", "18");
  arrow.className = "arrow-icon";

  // Montagem final
  btn.appendChild(esquerda);
  btn.appendChild(data);
  btn.appendChild(arrow);
  li.appendChild(btn);

  // ABRIR VIEW TASK
  btn.addEventListener("click", () => {
    currentTaskID = id;

    document.getElementById("view-name").textContent = tarefa.tarefa;
    document.getElementById("view-desc").textContent = tarefa.descricao;
    document.getElementById("view-category").textContent = tarefa.categoria || "Sem categoria";
    document.getElementById("view-date").textContent =
      tarefa.lembrar === "Sem lembrete"
        ? "Sem data"
        : new Date(tarefa.lembrar).toLocaleDateString("pt-PT");

    document.getElementById("view-status").textContent = tarefa.estado;

    viewTaskOverlay.classList.remove("hide");
    activeOverlay = viewTaskOverlay;
    document.body.classList.add("overflow-hidden");
  });

  destinoLista.appendChild(li);
}


// MOSTRAR MENSAGEM QUANDO VAZIO
function mostrarMensagemVazia(destinoLista, nomeCategoria) {
  const msg = document.createElement("li");
  msg.className = "task-item";
  msg.style.textAlign = "center";
  msg.style.color = "#777";
  msg.style.padding = "5px";
  msg.style.fontStyle = "italic";
  msg.style.fontSize = "15px";
  msg.textContent = `Sem tarefas em "${nomeCategoria}"`;
  destinoLista.appendChild(msg);
}

// CARREGAR TAREFAS
onAuthStateChanged(auth, async user => {
  if (!user) return (window.location.href = "index.html");

  userID = user.uid;
  const tarefas = await database.read(`/tarefas/${userID}`);

  let pendenteCount = 0;
  let progressoCount = 0;
  let concluidoCount = 0;

  if (tarefas) {
    Object.entries(tarefas).forEach(([id, tarefa]) => {
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

  // Mostrar mensagem se estiver vazio
  if (pendenteCount === 0) mostrarMensagemVazia(todoList, "Pendente");
  if (progressoCount === 0) mostrarMensagemVazia(doingList, "Em progresso");
  if (concluidoCount === 0) mostrarMensagemVazia(doneList, "Concluído");

  // Atualizar contadores
  document.getElementById("count-pendente").textContent = pendenteCount;
  document.getElementById("count-progresso").textContent = progressoCount;
  document.getElementById("count-concluido").textContent = concluidoCount;
});

// DELETE
document.getElementById("delete-task-btn").addEventListener("click", async () => {
  await database.remove(`/tarefas/${userID}/${currentTaskID}`);

  viewTaskOverlay.classList.add("hide");
  notification.classList.add("show");

  setTimeout(() => notification.classList.remove("show"), 3000);
  setTimeout(() => window.location.reload(), 500);
});
