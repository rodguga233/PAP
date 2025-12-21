import { database } from "../database/func.mjs";
import { auth, messaging } from "../database/db.mjs"; 

let noti= null;

// ---- NOTIFICAÇÕES (Firebase 8) ----
async function iniciarNotificacoes() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("O utilizador recusou as notificações");
      noti = "denied";
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

console.clear();
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("criarTarefa");

  iniciarNotificacoes();

  // Firebase 8 → auth.onAuthStateChanged
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userID = user.uid;
      console.log("Utilizador autenticado:", userID);

      const descricao = document.getElementById("descricao");

      if(noti === "denied"){
        document.getElementById("dataHora").disabled = true;
        document.getElementById("permissoes").style.display = "flex";
        document.getElementById("descricao").style.marginTop = "4px";
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const tarefa = document.getElementById("tarefa");
        if (!tarefa.value.trim()) {
          alert("Por favor, insira uma tarefa válida.");
          return;
        }

        
        if (!descricao.value.trim()) {
          descricao.value = "Sem descrição";
        }

        const categoria = document.getElementById("categoria");
        let categoriaValor = categoria.value.trim();

        if (!categoriaValor || categoriaValor === "Nenhuma") {
          categoriaValor = "Nenhuma";
        }

        const agora = new Date();

        console.log(
          "tarefa:", tarefa.value,
          "categoria:", categoriaValor,
          "descricao:", descricao.value
        );

        if (form.id === "criarTarefa") {

          console.log("ID do formulário correto.");

          const query = await database.addData(`/tarefas/${userID}`, {
            tarefa: tarefa.value,
            categoria: categoriaValor,
            descricao: descricao.value,
            estado: "Pendente",
            criado_em: agora.toLocaleString("pt-PT")
          });

          const no = `/tarefas/${userID}/${query}`;
          console.log("Nó criado:", no);

          alert("Tarefa criada com sucesso!");

          setTimeout(() => {
            window.location.href = "tarefas.html";
          }, 500);

        } else {
          console.log("Nome do formulário incorreto.");
        }
      });

    } else {
      alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  });
});
