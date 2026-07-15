import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { inicializarCriarTarefa } from "./criar-tarefa.mjs";
import { inicializarEditarTarefa } from "./editar-tarefa.mjs";
import { inicializarEliminarTarefa } from "./eliminar-tarefa.mjs";
import { carregarCategorias } from "./adicionar-categoria.mjs";

const list_1 = document.getElementById("list-1");
const list_2 = document.getElementById("list-2");
const list_3 = document.getElementById("list-3");

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
    const modo = btn.dataset.filter;
    localStorage.setItem("modoVisualizacao", modo);
    console.log(modo);
    aplicarModoVisualizacao(modo);
    filterMenu.classList.add("hide");
  });
});

// CRIAR CARD
async function criarCard(id, tarefa, destinoLista) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.style.paddingLeft = "9px";

  li.dataset.estado = tarefa.estado;
  li.dataset.prioridade = tarefa.prioridade;
  li.dataset.conclusao = tarefa.conclusao;
  li.dataset.categoria = tarefa.categoria;

  const modoVisualizacao = localStorage.getItem("modoVisualizacao") || "estado";

  if (modoVisualizacao !== "estado") {
    if (tarefa.estado === "Concluído") {
      li.classList.add("concluida");
    }
  }

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

  if (tarefa.categoria === "Nenhuma") {
    categoria.textContent = "";
  } else {
    const cat = await database.read(`categorias/${window.userID}/${tarefa.categoria}`);
    categoria.textContent = cat ? cat.nome : "Categoria removida";
  }

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

  const esquerda = document.createElement("div");
  esquerda.style.display = "flex";
  esquerda.style.flexDirection = "column";
  esquerda.style.flex = "1";

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

  btn.addEventListener("click", async () => {
    window.currentTaskID = id;
    document.getElementById("view-name").textContent = tarefa.tarefa;
    document.getElementById("view-desc").textContent = tarefa.descricao;

    if (tarefa.categoria === "Nenhuma") {
      document.getElementById("view-category").textContent = "Sem categoria";
    } else {
      const cat = await database.read(`categorias/${window.userID}/${tarefa.categoria}`);
      document.getElementById("view-category").textContent = cat ? cat.nome : "Categoria removida";
    }

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
  carregarCategorias(window.userID);

  // CARREGAR TAREFAS
  const tarefas = await database.read(`/tarefas/${window.userID}`);

  if (!tarefas) {
    // Conta é recente → não existem tarefas
    list_1.innerHTML = "";
    list_2.innerHTML = "";
    list_3.innerHTML = "";

    mostrarMensagemVazia(list_1, "Sem tarefas criadas");
    mostrarMensagemVazia(list_2, "Sem tarefas criadas");
    mostrarMensagemVazia(list_3, "Sem tarefas criadas");
    return;
  }

  // Se existem tarefas → aplicar modo de visualização
  setTimeout(() => {
    let modoGuardado = localStorage.getItem("modoVisualizacao");

    if (!modoGuardado) {
      modoGuardado = "estado";
      localStorage.setItem("modoVisualizacao", "estado");
    }

    aplicarModoVisualizacao(modoGuardado);
  }, 10);

});

// ORDENAR TAREFAS
function ordenarTarefas(tarefasObj) {
  const prioridadePeso = { "Alta": 1, "Média": 2, "Baixa": 3 };

  return Object.entries(tarefasObj).sort((a, b) => {
    const tarefaA = a[1];
    const tarefaB = b[1];

    const agora = Date.now();

    const dataA = tarefaA.conclusao === "Sem data"
      ? Infinity
      : new Date(tarefaA.conclusao).getTime();

    const dataB = tarefaB.conclusao === "Sem data"
      ? Infinity
      : new Date(tarefaB.conclusao).getTime();

    const atrasadaA = dataA < agora && tarefaA.estado !== "Concluído";
    const atrasadaB = dataB < agora && tarefaB.estado !== "Concluído";

    const semDataA = tarefaA.conclusao === "Sem data" && tarefaA.estado !== "Concluído";
    const semDataB = tarefaB.conclusao === "Sem data" && tarefaB.estado !== "Concluído";

    const concluidaA = tarefaA.estado === "Concluído";
    const concluidaB = tarefaB.estado === "Concluído";

    // 1. ATRASADAS primeiro
    if (atrasadaA && !atrasadaB) return -1;
    if (!atrasadaA && atrasadaB) return 1;

    // 2. CONCLUÍDAS sempre no fim
    if (concluidaA && !concluidaB) return 1;
    if (!concluidaA && concluidaB) return -1;

    // 3. SEM DATA depois das próximas
    if (semDataA && !semDataB) return 1;
    if (!semDataA && semDataB) return -1;

    // 4. PRIORIDADE (Alta → Média → Baixa)
    const diffPrioridade = prioridadePeso[tarefaA.prioridade] - prioridadePeso[tarefaB.prioridade];
    if (diffPrioridade !== 0) return diffPrioridade;

    // 5. Dentro da mesma prioridade:
    //    - Atrasadas: mais atrasada primeiro (data mais antiga)
    //    - Próximas: mais perto primeiro (data mais próxima)
    //    - Sem data: mantém prioridade
    //    - Concluídas: mais recentes primeiro
    if (concluidaA && concluidaB) {
      return dataB - dataA; // mais recente primeiro
    }
    
    return dataA - dataB;
  });
}

// MODO DE VISUALIZACAO
async function aplicarModoVisualizacao(modo) {
  await reconstruirTarefas(); // ← RECONSTRÓI TODAS AS TAREFAS

  if (modo === "estado") organizarPorEstado();
  else if (modo === "prioridade") organizarPorPrioridade();
  else if (modo === "data") organizarPorData();
  else if (modo === "categoria") organizarPorCategoria();
}

// ORGANIZAR POR ESTADO
function organizarPorEstado() {
  const tarefas = Array.from(document.querySelectorAll(".task-item"));

  list_1.innerHTML = "";
  list_2.innerHTML = "";
  list_3.innerHTML = "";

  document.getElementById("list-header-1").textContent = "Pendente";
  document.getElementById("list-header-2").textContent = "Em progresso";
  document.getElementById("list-header-3").textContent = "Concluído";

  const pendente = [];
  const progresso = [];
  const concluido = [];

  tarefas.forEach(t => {
    const estado = t.dataset.estado;

    if (estado === "Pendente") pendente.push(t);
    else if (estado === "Em progresso") progresso.push(t);
    else concluido.push(t);
  });

  document.getElementById("count-header-1").textContent = pendente.length;
  document.getElementById("count-header-2").textContent = progresso.length;
  document.getElementById("count-header-3").textContent = concluido.length;

  // renderizar tarefas
  pendente.forEach(t => list_1.appendChild(t));
  progresso.forEach(t => list_2.appendChild(t));
  concluido.forEach(t => list_3.appendChild(t));

  if (pendente.length === 0) mostrarMensagemVazia(list_1, "Pendente");
  if (progresso.length === 0) mostrarMensagemVazia(list_2, "Em progresso");
  if (concluido.length === 0) mostrarMensagemVazia(list_3, "Concluído");
}

// ORGANIZAR POR PRIORIDADE
function organizarPorPrioridade() {
  const tarefas = Array.from(document.querySelectorAll(".task-item"));

  // limpar listas
  list_1.innerHTML = "";
  list_2.innerHTML = "";
  list_3.innerHTML = "";

  // headers
  document.getElementById("list-header-1").textContent = "Prioridade Alta";
  document.getElementById("list-header-2").textContent = "Prioridade Média";
  document.getElementById("list-header-3").textContent = "Prioridade Baixa";

  const alta = [];
  const media = [];
  const baixa = [];

  tarefas.forEach(t => {
    const prioridade = t.dataset.prioridade;

    if (prioridade === "Alta") alta.push(t);
    else if (prioridade === "Média") media.push(t);
    else baixa.push(t);
  });

  // contadores
  document.getElementById("count-header-1").textContent = alta.length;
  document.getElementById("count-header-2").textContent = media.length;
  document.getElementById("count-header-3").textContent = baixa.length;

  // renderizar
  alta.forEach(t => list_1.appendChild(t));
  media.forEach(t => list_2.appendChild(t));
  baixa.forEach(t => list_3.appendChild(t));

  if (alta.length === 0) mostrarMensagemVazia(list_1, "Prioridade Alta");
  if (media.length === 0) mostrarMensagemVazia(list_2, "Prioridade Média");
  if (baixa.length === 0) mostrarMensagemVazia(list_3, "Prioridade Baixa");
}

// ORGANIZAR POR DATA
function organizarPorData() {
  const tarefas = Array.from(document.querySelectorAll(".task-item"));

  // limpar listas existentes
  list_1.innerHTML = "";
  list_2.innerHTML = "";
  list_3.innerHTML = "";

  // criar retângulo extra
  criarRetanguloExtra("proximas-list","#b38bff","list-header-4","count-header-4");
  criarRetanguloExtra("semdata-list", "yellow", "list-header-5", "count-header-5");

  // headers
  document.getElementById("list-header-1").textContent = "Atrasadas";
  document.getElementById("list-header-2").textContent = "Hoje";
  document.getElementById("list-header-3").textContent = "Amanhã";
  document.getElementById("list-header-4").textContent = "Próximas";
  document.getElementById("list-header-5").textContent = "Sem data";

  const atrasadas = [];
  const hoje = [];
  const amanha = [];
  const proximas = [];
  const semdata = [];

  const agora = new Date();

  tarefas.forEach(t => {
    const conclusao = t.dataset.conclusao;

    if (!conclusao || conclusao === "Sem data") {
      semdata.push(t);
      return;
    }

    const dataTarefa = new Date(conclusao);

    // 1. ATRASADAS (data/hora já passou)
    if (dataTarefa < agora) {
      atrasadas.push(t);
      return;
    }

    // 2. HOJE
    const hojeData = new Date();
    hojeData.setHours(0,0,0,0);

    const dataLimpa = new Date(dataTarefa.getFullYear(), dataTarefa.getMonth(), dataTarefa.getDate());

    if (dataLimpa.getTime() === hojeData.getTime()) {
      hoje.push(t);
      return;
    }

    // 3. AMANHÃ
    const amanhaData = new Date(hojeData);
    amanhaData.setDate(amanhaData.getDate() + 1);

    if (dataLimpa.getTime() === amanhaData.getTime()) {
      amanha.push(t);
      return;
    }

    // 4. PRÓXIMAS
    proximas.push(t);
  });

  // contadores
  document.getElementById("count-header-1").textContent = atrasadas.length;
  document.getElementById("count-header-2").textContent = hoje.length;
  document.getElementById("count-header-3").textContent = amanha.length;
  document.getElementById("count-header-4").textContent = proximas.length;
  document.getElementById("count-header-5").textContent = semdata.length;

  // renderizar
  atrasadas.forEach(t => list_1.appendChild(t));
  hoje.forEach(t => list_2.appendChild(t));
  amanha.forEach(t => list_3.appendChild(t));
  proximas.forEach(t => document.getElementById("proximas-list").appendChild(t));
  semdata.forEach(t => document.getElementById("semdata-list").appendChild(t));

  if (atrasadas.length === 0) mostrarMensagemVazia(list_1, "Atrasadas");
  if (hoje.length === 0) mostrarMensagemVazia(list_2, "Hoje");
  if (amanha.length === 0) mostrarMensagemVazia(list_3, "Amanhã");

  const proximasList = document.getElementById("proximas-list");
  const semdataList = document.getElementById("semdata-list");

  if (proximas.length === 0) mostrarMensagemVazia(proximasList, "Próximas");
  if (semdata.length === 0) mostrarMensagemVazia(semdataList, "Sem data");
}

// ORGANIZAR POR CATEGORIA
async function organizarPorCategoria() {
  const tarefas = Array.from(document.querySelectorAll(".task-item"));

  // limpar listas existentes
  list_1.innerHTML = "";
  list_2.innerHTML = "";
  list_3.innerHTML = "";

  // remover retângulos extra anteriores
  removerRetangulosExtras();

  // headers fixos
  document.getElementById("list-header-1").textContent = "Trabalho";
  document.getElementById("list-header-2").textContent = "Estudos";
  document.getElementById("list-header-3").textContent = "Lazer";

  const trabalho = [];
  const estudos = [];
  const lazer = [];
  const casa = [];
  const semCategoria = [];

  // 1. Buscar categorias personalizadas
  const categoriasPersonalizadas = await database.read(`categorias/${window.userID}`) || {};

  const mapaExtras = {};

  Object.entries(categoriasPersonalizadas).forEach(([id, cat]) => {
    mapaExtras[id] = {
      id,
      nome: cat.nome,
      cor: cat.cor || "#b38bff",
      tarefas: []
    };
  });

  // 2. Distribuir tarefas
  for (const t of tarefas) {
    const catID = t.dataset.categoria;
    let nomeCat;

    if (!catID || catID === "Nenhuma") {
      nomeCat = "Sem categoria";
    } else if (mapaExtras[catID]) {
      nomeCat = mapaExtras[catID].nome;
    } else {
      nomeCat = "Categoria removida";
    }

    switch (nomeCat) {
      case "Trabalho":
        trabalho.push(t);
        break;
      case "Estudos":
        estudos.push(t);
        break;
      case "Lazer":
        lazer.push(t);
        break;
      case "Casa":
        casa.push(t);
        break;
      case "Sem categoria":
        semCategoria.push(t);
        break;
      default:
        mapaExtras[catID]?.tarefas.push(t);
        break;
    }
  }

  // ⭐ ATUALIZAR CONTADORES FIXOS (o que estava a faltar!)
  document.getElementById("count-header-1").textContent = trabalho.length;
  document.getElementById("count-header-2").textContent = estudos.length;
  document.getElementById("count-header-3").textContent = lazer.length;

  // 3. Renderizar categorias fixas
  trabalho.forEach(t => list_1.appendChild(t));
  estudos.forEach(t => list_2.appendChild(t));
  lazer.forEach(t => list_3.appendChild(t));

  if (trabalho.length === 0) mostrarMensagemVazia(list_1, "Trabalho");
  if (estudos.length === 0) mostrarMensagemVazia(list_2, "Estudos");
  if (lazer.length === 0) mostrarMensagemVazia(list_3, "Lazer");

  // 4. Secção fixa: CASA
  criarRetanguloExtra(
    "categoria-list-casa",
    "#b38bff",
    "categoria-header-casa",
    "categoria-count-casa"
  );

  document.getElementById("categoria-header-casa").textContent = "Casa";
  document.getElementById("categoria-count-casa").textContent = casa.length;

  const listaCasa = document.getElementById("categoria-list-casa");
  casa.forEach(t => listaCasa.appendChild(t));

  if (casa.length === 0) mostrarMensagemVazia(listaCasa, "Casa");

  // 5. Secções dinâmicas
  Object.values(mapaExtras).forEach(catInfo => {
    if (catInfo.tarefas.length === 0) return;

    const listaID = `categoria-list-${catInfo.id}`;
    const headerID = `categoria-header-${catInfo.id}`;
    const countID = `categoria-count-${catInfo.id}`;

    criarRetanguloExtra(listaID, catInfo.cor, headerID, countID);

    document.getElementById(headerID).textContent = catInfo.nome;
    document.getElementById(countID).textContent = catInfo.tarefas.length;

    const lista = document.getElementById(listaID);
    catInfo.tarefas.forEach(t => lista.appendChild(t));
  });

  // 6. Secção fixa: SEM CATEGORIA
  criarRetanguloExtra(
    "categoria-list-semcat",
    "#ffff8b",
    "categoria-header-semcat",
    "categoria-count-semcat"
  );

  document.getElementById("categoria-header-semcat").textContent = "Sem categoria";
  document.getElementById("categoria-count-semcat").textContent = semCategoria.length;

  const listaSemCat = document.getElementById("categoria-list-semcat");
  semCategoria.forEach(t => listaSemCat.appendChild(t));

  if (semCategoria.length === 0) mostrarMensagemVazia(listaSemCat, "Sem categoria");
}

// CRIAR ESPAÇO EXTRA (usa cor da Firebase na shadow)
function criarRetanguloExtra(idLista, corHex, tituloId, contadorId) {
  const container = document.createElement("div");
  container.className = "list-container";

  container.style.boxShadow = `6px 6px 0px ${corHex}`;

  container.innerHTML = `
    <h2 class="list-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span id="${tituloId}" class="text" style="font-size:20px; font-weight:600;"></span>
      </div>
      <span id="${contadorId}" style="font-size:16px; font-weight:500; color:#555;">0</span>
    </h2>
    <ul id="${idLista}" class="tasks-list"></ul>
  `;

  document.getElementById("list-view").appendChild(container);
}

// REMOVER ESPAÇO EXTRA
function removerRetangulosExtras() {
  const extras = document.querySelectorAll(".list-container");
  extras.forEach(e => {
    if (!e.contains(list_1) && !e.contains(list_2) && !e.contains(list_3)) {
      e.remove();
    }
  });
}

// CARREGAR TAREFAS NOVAMENTE 
async function reconstruirTarefas() {
  // limpar listas base
  list_1.innerHTML = "";
  list_2.innerHTML = "";
  list_3.innerHTML = "";

  // remover retângulos extra
  removerRetangulosExtras();

  const tarefas = await database.read(`/tarefas/${window.userID}`);

  if (!tarefas) return;

  const ordenadas = ordenarTarefas(tarefas);

  for (const [id, tarefa] of ordenadas) {
    await criarCard(id, tarefa, list_1); // destino não importa, vai ser reorganizado depois
  }
}

