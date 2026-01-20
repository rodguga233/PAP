import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

let noti = null;

console.clear();
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM carregado com sucesso!!!");

  const form = document.getElementById("criarTarefa");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userID = user.uid;
      console.log("Utilizador autenticado:", userID);

      database.listen(`/users/${userID}/notificacoes`, (valor) => {
        noti = valor;

        const dataHora = document.getElementById("dataHora");
        const permissoes = document.getElementById("permissoes");
        const descricaoLabel = document.getElementById("descricaoLabel");

        if (noti === false) {
          dataHora.disabled = true;
          dataHora.style.opacity = "0.5";
          permissoes.style.display = "flex";
          descricaoLabel.style.marginTop = "4px";
        } else {
          dataHora.disabled = false;
          dataHora.style.opacity = "1";
          permissoes.style.display = "none";
          descricaoLabel.style.marginTop = "20px";
        }
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const tarefaVal = document.getElementById("tarefa").value;
        const categoriaVal = document.getElementById("categoria").value;
        const descricaoVal = document.getElementById("descricao").value || "Sem descrição";
        const agora = new Date();

        let lembreteVal;

        if (noti === false) {
          lembreteVal = "Sem lembrete";
        } else {
          if (document.getElementById("dataHora").value <= agora.toISOString()) {
            alert("A data e hora do lembrete invalidaas.");
            return;
          }
          lembreteVal = document.getElementById("dataHora").value || "Sem lembrete";
        }

        const novaTarefa = {
          tarefa: tarefaVal,
          categoria: categoriaVal,
          descricao: descricaoVal,
          lembrar: lembreteVal,
          estado: "Pendente",
          notificado: false,
          criado_em: agora.toLocaleString("pt-PT")
        };

        try {
          const tarefaID = await database.addData(`/tarefas/${userID}`, novaTarefa);

          console.log("Tarefa criada:", tarefaID);
          alert("Tarefa criada com sucesso!");

          setTimeout(() => {
            window.location.href = "tarefas.html";
          }, 500);

        } catch (error) {
          console.error("Erro ao criar tarefa:", error);
          alert("Não foi possível criar a tarefa.");
        }
      });

    } else {
      alert("Nenhum utilizador autenticado. Faça login para criar tarefas.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  });
});