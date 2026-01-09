import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const botao = document.getElementById("toggleNotificacoes");

onAuthStateChanged(auth, async (user) => {

    const index = `users/${user.uid}/notificacoes`;

    const estadoAtual = await database.read(index);
    let estado = estadoAtual ?? false;

    atualizarBotao(estado);

    botao.addEventListener("click", async () => {
        estado = !estado;

        await database.write(index, estado);

        atualizarBotao(estado);
    });
});

function atualizarBotao(estado) {
    if (estado) {
        botao.textContent = "Notificações: ON";
        botao.style.backgroundColor = "#2ecc71";
    } else {
        botao.textContent = "Notificações: OFF";
        botao.style.backgroundColor = "#3457D5";
    }
}
