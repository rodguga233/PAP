import { database } from "../database/func.mjs";

export function inicializarCriarTarefa(userID) {
  document.getElementById("form-add").addEventListener("submit", async (event) => {

    // 🚫 NÃO CRIAR SE ESTAMOS A EDITAR
    if (window.editar) return;

    event.preventDefault();

    const nomeVal = document.getElementById("add-name").value.trim();
    const categoriaVal = document.getElementById("add-category").value.trim();
    const descVal = document.getElementById("add-desc").value.trim() || "Sem descrição";
    const prioridadeVal = document.getElementById("add-prioridade").value;
    const dataVal = document.getElementById("add-date").value;
    const agora = new Date();

    let conclusaoVal;

    if (dataVal && dataVal <= agora.toISOString()) {
      alert("A data e hora são inválidas.");
      return;
    }

    conclusaoVal = dataVal || "Sem data";

    try {
      const novaTarefa = {
        tarefa: nomeVal,
        categoria: categoriaVal,
        descricao: descVal,
        conclusao: conclusaoVal,
        estado: "Pendente",
        prioridade: prioridadeVal,
        notificado: false,
        criado_em: agora.toLocaleString("pt-PT")
      };

      await database.addData(`/tarefas/${userID}`, novaTarefa);
      sessionStorage.setItem("taskMessage", "Tarefa criada com sucesso!");

      window.location.reload();

    } catch (error) {
      console.error("Erro ao guardar tarefa:", error);
      alert("Não foi possível guardar a tarefa.");
    }
  });
}
