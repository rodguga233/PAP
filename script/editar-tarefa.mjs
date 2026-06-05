import { database } from "../database/func.mjs";

export function inicializarEditarTarefa(userID) {
  document.getElementById("edit-task-btn").addEventListener("click", async () => {
    const currentTaskID = document.getElementById("view-name").dataset.taskId || window.currentTaskID;
    document.getElementById("view-name").dataset.taskId = currentTaskID;

    
    if (!currentTaskID) return alert("Erro: nenhuma tarefa selecionada.");

    try {
      const tarefa = await database.read(`/tarefas/${userID}/${currentTaskID}`);

      if (tarefa) {
        window.editar = true;

        const viewTaskOverlay = document.getElementById("view-task-overlay");
        const setTaskOverlay = document.getElementById("set-task-overlay");

        viewTaskOverlay.classList.add("hide");
        setTaskOverlay.classList.remove("hide");
        window.activeOverlay = setTaskOverlay;

        document.getElementById("overlay-title").textContent = "Editar tarefa";
        document.getElementById("overlay-submit-btn").textContent = "Atualizar";

        document.getElementById("add-name").value = tarefa.tarefa;
        document.getElementById("add-category").value = tarefa.categoria || "Nenhuma";
        document.getElementById("add-desc").value = tarefa.descricao === "Sem descrição" ? "" : tarefa.descricao;
        document.getElementById("add-prioridade").value = tarefa.prioridade || "Baixa";
        document.getElementById("add-status").value = tarefa.estado;

        if (tarefa.conclusao !== "Sem data") {
          const dt = new Date(tarefa.conclusao);

          const ano = dt.getFullYear();
          const mes = String(dt.getMonth() + 1).padStart(2, "0");
          const dia = String(dt.getDate()).padStart(2, "0");
          const horas = String(dt.getHours()).padStart(2, "0");
          const minutos = String(dt.getMinutes()).padStart(2, "0");

          document.getElementById("add-date").value = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
        }
      }
    } catch (error) {
      console.error("Erro ao abrir edição:", error);
      alert("Não foi possível abrir o formulário de edição.");
    }
  });

  // Evento de submit para editar
  document.getElementById("form-add").addEventListener("submit", async (event) => {
    if (!window.editar) return; // Sair se não está em modo edição

    event.preventDefault();

    const currentTaskID = window.currentTaskID;
    if (!currentTaskID) return;

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
      const tarefaAnterior = await database.read(`/tarefas/${userID}/${currentTaskID}`);
      const estadoVal = document.getElementById("add-status").value;

      await database.updateData(`/tarefas/${userID}/${currentTaskID}`, {
        tarefa: nomeVal,
        categoria: categoriaVal,
        prioridade: prioridadeVal,
        descricao: descVal,
        conclusao: conclusaoVal,
        estado: estadoVal,
        notificado: tarefaAnterior.notificado,
        criado_em: tarefaAnterior.criado_em
      });

      sessionStorage.setItem("taskMessage", "Tarefa atualizada com sucesso!");
      window.editar = false;

      window.location.reload();

    } catch (error) {
      console.error("Erro ao guardar tarefa:", error);
      alert("Não foi possível guardar a tarefa.");
    }
  });
}
