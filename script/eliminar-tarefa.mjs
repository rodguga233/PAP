import { database } from "../database/func.mjs";

export function inicializarEliminarTarefa(userID) {
  document.getElementById("delete-task-btn").addEventListener("click", async () => {
    const currentTaskID = window.currentTaskID;

    if (!currentTaskID) return alert("Erro: nenhuma tarefa selecionada.");

    try {
      await database.removeData(`/tarefas/${userID}/${currentTaskID}`);

      sessionStorage.setItem("taskMessage", "Tarefa eliminada com sucesso!");
      window.location.reload();

    } catch (error) {
      console.error("Erro ao eliminar tarefa:", error);
      alert("Não foi possível eliminar a tarefa.");
    }
  });
}
