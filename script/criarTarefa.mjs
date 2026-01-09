import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs";

let noti = null;

console.clear();
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("criarTarefa");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Precisas de estar autenticado para criar tarefas.");
      return;
    }

    const userID = user.uid;

    const tarefa = document.getElementById("tarefa").value;
    const categoria = document.getElementById("categoria").value;
    const dataHora = document.getElementById("dataHora").value;
    const descricao = document.getElementById("descricao").value || "Sem descrição";
    const agora = new Date();

    if (form.id === "criarTarefa") {

      console.log("ID do formulário correto.");

      // Estrutura da tarefa (igual à tua no Firebase)
      const novaTarefa = {
        tarefa: tarefa,
        categoria: categoria,
        lembrar: dataHora || null,
        descricao: descricao,
        estado: "Pendente",
        notificado: false,
        criado_em: agora.toLocaleString("pt-PT")
      };

      try {
        const tarefaID = await database.pushData(`/tarefas/${userID}`, novaTarefa);

        alert("Tarefa criada com sucesso!");
        console.log("Tarefa criada:", `/tarefas/${userID}/${tarefaID}`);

        setTimeout(() => {
          window.location.href = "tarefas.html";
        }, 500);

      } catch (error) {
        console.error("Erro ao criar tarefa:", error);

        setTimeout(() => {
          alert("Erro ao criar a tarefa: " + error.message);
          window.location.reload();
        }, 3000);
      }

    } else {
      console.log("Nome do formulário incorreto.");
    }
  });
});
