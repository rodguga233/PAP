import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs";

// ELEMENTOS DO SELECT
const selectCategoria = document.getElementById("add-category");

// POPUP DE CRIAR/EDITAR
const popup = document.getElementById("popup-categoria");
const popupTitulo = document.getElementById("popup-cat-titulo");
const popupNome = document.getElementById("popup-cat-nome");
const popupCor = document.getElementById("popup-cat-cor");

const btnCancelar = document.getElementById("popup-cat-cancelar");
const btnConfirmar = document.getElementById("popup-cat-confirmar");
const btnEliminar = document.getElementById("popup-cat-eliminar");

// POPUP DE GERIR CATEGORIAS
const popupGerir = document.getElementById("popup-gerir-categorias");
const listaCategorias = document.getElementById("lista-categorias");
const btnCriarCat = document.getElementById("btn-criar-cat");
const btnFecharGerir = document.getElementById("btn-fechar-gerir");

// BOTÃO GERIR CATEGORIAS (dropdown do perfil)
const btnOpenGerir = document.getElementById("btn-open-gerir-categorias");

// BOTÃO GERIR CATEGORIAS (no formulário)
const btnGerir = document.getElementById("btn-gerir-categorias");

let uid = null;
let categoriaAtualID = null;

// ===============================
// OBTER UID DO UTILIZADOR
// ===============================
auth.onAuthStateChanged((user) => {
  if (!user) return;
  uid = user.uid;
  carregarCategorias(uid);
});

// ===============================
// FUNÇÃO: ABRIR POPUP DE CRIAR CATEGORIA
// ===============================
function abrirPopupCriar() {
  categoriaAtualID = null;

  popupTitulo.textContent = "Nova categoria";
  popupNome.value = "";
  popupCor.value = "#FFB800";

  btnConfirmar.textContent = "Guardar";
  btnEliminar.style.display = "none";

  popup.classList.remove("hide");
  document.body.classList.add("overflow-hidden");
}

// ===============================
// FUNÇÃO: ABRIR POPUP DE EDITAR CATEGORIA
// ===============================
function abrirPopupEditar(id, cat) {
  categoriaAtualID = id;

  popupTitulo.textContent = "Editar categoria";
  popupNome.value = cat.nome;
  popupCor.value = cat.cor;

  btnConfirmar.textContent = "Atualizar";
  btnEliminar.style.display = "block";

  popupGerir.classList.add("hide");
  popup.classList.remove("hide");
  document.body.classList.add("overflow-hidden");
}

// ===============================
// ABRIR POPUP GERIR CATEGORIAS
// ===============================
function abrirPopupGerir() {
  popupGerir.classList.remove("hide");
  carregarListaCategorias();
}

btnOpenGerir.addEventListener("click", abrirPopupGerir);

// ===============================
// CARREGAR LISTA DE CATEGORIAS PERSONALIZADAS
// ===============================
function carregarListaCategorias() {
  listaCategorias.innerHTML = "";

  database.read(`categorias/${uid}`).then((categorias) => {
    if (!categorias) {

      const msg = document.createElement("div");
      msg.style = "padding:10px; background:#fff; border-radius:6px;";
      msg.textContent = "Não tens categorias personalizadas.";
      listaCategorias.appendChild(msg);
      return;
    }

    Object.entries(categorias).forEach(([id, cat]) => {

      const item = document.createElement("div");
      item.style = `
        padding:10px;
        background:#fff;
        border-radius:6px;
        cursor:pointer;
        display:flex;
        align-items:center;
        gap:10px;
      `;

      // CÍRCULO DA COR DA CATEGORIA
      const bolinha = document.createElement("div");
      bolinha.style = `
        width:16px;
        height:16px;
        border-radius:50%;
        background:${cat.cor};
        flex-shrink:0;
      `;

      // Nome da categoria
      const nome = document.createElement("span");
      nome.textContent = cat.nome;
      nome.style = "font-size:15px; font-weight:500;";

      item.appendChild(bolinha);
      item.appendChild(nome);

      item.addEventListener("click", () => abrirPopupEditar(id, cat));

      listaCategorias.appendChild(item);
    });
  });
}


// ===============================
// BOTÃO CRIAR NOVA CATEGORIA (no popup gerir)
// ===============================
btnCriarCat.addEventListener("click", () => {
  abrirPopupCriar();
  popupGerir.classList.add("hide");
});

// ===============================
// BOTÃO FECHAR POPUP GERIR
// ===============================
btnFecharGerir.addEventListener("click", () => {
  popupGerir.classList.add("hide");
});

// ===============================
// BOTÃO CANCELAR (voltar ao popup gerir)
// ===============================
btnCancelar.addEventListener("click", () => {
  popup.classList.add("hide");
  popupGerir.classList.remove("hide");
  document.body.classList.remove("overflow-hidden");
});

// ===============================
// GUARDAR OU CRIAR CATEGORIA
// ===============================
btnConfirmar.addEventListener("click", async () => {
  const nome = popupNome.value.trim();
  const cor = popupCor.value;

  if (!nome) {
    alert("Escreve um nome para a categoria.");
    return;
  }

  if (!categoriaAtualID) {
    await database.addData(`categorias/${uid}`, { nome, cor });
  } else {
    await database.updateData(`categorias/${uid}/${categoriaAtualID}`, { nome, cor });
  }

  carregarCategorias(uid);
  carregarListaCategorias();

  popup.classList.add("hide");
  popupGerir.classList.remove("hide");
  document.body.classList.remove("overflow-hidden");
});

// ===============================
// ELIMINAR CATEGORIA
// ===============================
btnEliminar.addEventListener("click", async () => {
  if (!categoriaAtualID) return;

  // 1. Verificar se existem tarefas com esta categoria
  const tarefas = await database.read(`tarefas/${uid}`);

  let temTarefas = false;

  if (tarefas) {
    Object.values(tarefas).forEach(tarefa => {
      if (tarefa.categoria === categoriaAtualID) {
        temTarefas = true;
      }
    });
  }

  // 2. Se existirem tarefas → impedir eliminação
  if (temTarefas) {
    alert("Não podes eliminar esta categoria porque existem tarefas associadas a ela.");
    return;
  }

  // 3. Confirmar eliminação
  const confirmar = confirm("Tens a certeza que queres eliminar esta categoria?");
  if (!confirmar) return;

  // 4. Eliminar categoria
  await database.removeData(`categorias/${uid}/${categoriaAtualID}`);

  // 5. Atualizar UI
  carregarCategorias(uid);
  carregarListaCategorias();

  popup.classList.add("hide");
  popupGerir.classList.remove("hide");
  document.body.classList.remove("overflow-hidden");
});


// ===============================
// CARREGAR CATEGORIAS NO SELECT
// ===============================
export function carregarCategorias(uid) {
  database.listen(`categorias/${uid}`, (categorias) => {
    selectCategoria.innerHTML = `
      <option value="Nenhuma">Sem categoria</option>
      <option value="Trabalho">Trabalho</option>
      <option value="Estudos">Estudos</option>
      <option value="Lazer">Lazer</option>
      <option value="Casa">Casa</option>
    `;

    if (categorias) {
      Object.entries(categorias).forEach(([id, cat]) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = cat.nome;
        selectCategoria.appendChild(opt);
      });
    }
  });
}
