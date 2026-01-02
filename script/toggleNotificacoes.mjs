import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs"; 

const botao = document.getElementById("toggleNotificacoes");

auth.onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}/notificacoesAtivas`);
    const snap = await get(userRef);

    let estado = snap.exists() ? snap.val() : false;

    // Atualiza o botão ao carregar a página
    atualizarBotao(estado);

    botao.addEventListener("click", async () => {
        estado = !estado; // alterna ON/OFF

        await database.update(userRef, estado);

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
