import { auth } from "../database/db.mjs";
import { database } from "../database/func.mjs";
import { onAuthStateChanged, updatePassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// POPUP
function showPopup(message, color = "green-background") {
  const notification = document.getElementById("notification");

  notification.querySelector("p").textContent = message;

  notification.classList.remove("green-background", "red-background", "yellow-background");
  notification.classList.add(color);

  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// ELEMENTOS
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const notifInput = document.getElementById("notificacoes");
const saveBtn = document.getElementById("save-profile");
const backBtn = document.getElementById("back-btn");
const passwordError = document.getElementById("password-error");
const profilePhoto = document.getElementById("profile-photo");
const photoInput = document.getElementById("photo-input");
const passConfirmInput = document.getElementById("password-confirm");
const passMatchError = document.getElementById("password-match-error");

passwordError.style.display = "none";

let novaFotoFile = null;
let fotoAntigaURL = null;

// ABRIR SELETOR DE FICHEIRO
document.getElementById("change-photo-btn").addEventListener("click", () => {
  photoInput.click();
});

// PRÉ‑VISUALIZAÇÃO
photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  novaFotoFile = file;

  const previewURL = URL.createObjectURL(file);
  profilePhoto.src = previewURL;
});

// CARREGAR DADOS DO UTILIZADOR
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userID = user.uid;
  const data = await database.read(`users/${userID}`);

  nomeInput.value = data?.nome || "";
  emailInput.value = user.email;
  notifInput.checked = data?.notificacoes ?? true;

  if (!data?.fotoPerfil || data.fotoPerfil === "Nenhuma") {
    profilePhoto.src = "img/perfil.jpg";
    fotoAntigaURL = null;
  } else {
    profilePhoto.src = data.fotoPerfil;
    fotoAntigaURL = data.fotoPerfil;
  }
});

// GUARDAR ALTERAÇÕES
saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userID = user.uid;

  // VALIDAR PASSWORD E CONFIRMAÇÃO
  const novaPass = passInput.value.trim();
  const confirmarPass = passConfirmInput.value.trim();

  if (novaPass !== "" || confirmarPass !== "") {

    // 1. Verificar se coincidem
    if (novaPass !== confirmarPass) {
      passMatchError.style.display = "block";
      return;
    } else {
      passMatchError.style.display = "none";
    }

    // 2. Verificar tamanho mínimo
    if (novaPass.length < 6) {
      passwordError.style.display = "block";
      return;
    } else {
      passwordError.style.display = "none";
    }

    // 3. Atualizar password no Firebase
    try {
      await updatePassword(user, novaPass); 
      passInput.value = "";
      passConfirmInput.value = "";
    } catch (error) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        showPopup("A tua sessão expirou. Faz login novamente.", "yellow-background");
        signOut(auth);
        window.location.href = "index.html";
        return;
      }
      showPopup("Erro ao atualizar password.", "red-background");
      console.log(error);
      return;
    }
  }

  let fotoFinal = fotoAntigaURL;

  // UPLOAD DA FOTO
  if (novaFotoFile) {
    const formData = new FormData();
    formData.append("file", novaFotoFile);
    formData.append("UPLOADCARE_PUB_KEY", "e329d04518c68a368a53");
    formData.append("UPLOADCARE_STORE", "1");

    const response = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    const fileName = encodeURIComponent(novaFotoFile.name);
    const cdnBase = "https://4zj5kc2lja.ucarecd.net";

    fotoFinal = `${cdnBase}/${result.file}/${fileName}`;

    profilePhoto.src = fotoFinal;
    novaFotoFile = null;
  }

  // ATUALIZAR
  await database.updateData(`users/${userID}`, {
    nome: nomeInput.value,
    notificacoes: notifInput.checked,
    fotoPerfil: fotoFinal || "Nenhuma"
  });

  showPopup("Perfil atualizado com sucesso!");
});

// VOLTAR
backBtn.addEventListener("click", () => {
  window.location.href = "tarefas.html";
});

import { deleteUser } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getDatabase, ref, remove } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

// ELEMENTOS DO POPUP
const popupEliminar = document.getElementById("popup-eliminar-conta");
const btnConfirmarEliminar = document.getElementById("confirmar-eliminar");
const btnCancelarEliminar = document.getElementById("cancelar-eliminar");

// ABRIR POPUP AO CLICAR NO BOTÃO
document.getElementById("delete-account-btn").addEventListener("click", () => {
  popupEliminar.classList.remove("hide");
});

// CANCELAR → FECHAR POPUP
btnCancelarEliminar.addEventListener("click", () => {
  popupEliminar.classList.add("hide");
});

// CONFIRMAR → ELIMINAR CONTA
btnConfirmarEliminar.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const db = getDatabase();

  try {
    // 1️⃣ ELIMINAR DADOS DO UTILIZADOR
    await remove(ref(db, `users/${uid}`));
    await remove(ref(db, `tarefas/${uid}`));
    await remove(ref(db, `categorias/${uid}`));

    // 2️⃣ ELIMINAR CONTA DO AUTHENTICATION
    await deleteUser(user);

    alert("Conta eliminada com sucesso!");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);

    if (error.code === "auth/requires-recent-login") {
      alert("A tua sessão expirou. Faz login novamente para eliminar a conta.");
      signOut(auth);
      window.location.href = "index.html";
      return;
    }

    alert("Erro ao eliminar conta. Tenta novamente.");
  }
});
