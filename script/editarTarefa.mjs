import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

let noti = null;

console.clear();
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM carregado com sucesso!!!");
  let form = document.getElementById("editarTarefa");
  let id;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userID = user.uid;
      console.log("Utilizador autenticado:", userID);

      // ler o estado das notificações
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

      // pegar o id através dos parâmetros no URL
      const params = new URLSearchParams(window.location.search);
      id = params.get("idTarefa");

      if (id) {
        sessionStorage.setItem("idTarefa", id);
      } else {
        id = sessionStorage.getItem("idTarefa");
      }

      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("ID da tarefa:", id);

      const tarefa = await database.read(`/tarefas/${userID}/${id}`);
      console.log("Tarefa carregada:", tarefa);

      if (tarefa) {
        document.getElementById("tarefa").value = tarefa.tarefa;
        document.getElementById("categoria").value = tarefa.categoria;

        if (tarefa.descricao === " Sem descrição"){
          document.getElementById("descricao").value = "";
        } else {
          document.getElementById("descricao").value = tarefa.descricao;
        }
        
        if (noti === false) {
          document.getElementById("dataHora").disabled = true;
          document.getElementById("permissoes").style.display = "flex";
          document.getElementById("descricaoLabel").style.marginTop = "4px";
        } else {
          if (tarefa.lembrar !== "Sem lembrete") {
            document.getElementById("dataHora").value = tarefa.lembrar;
          }
        }

        // adicionar checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox";
        if (tarefa.estado === "Concluído" || tarefa.estado === "Concluída") {
          checkbox.checked = true;
        }

        const marcarEstado = document.getElementById("marcarEstado");
        marcarEstado.innerHTML = "Marcar como concluído:";
        marcarEstado.appendChild(checkbox);

        form.addEventListener("submit", async (event) => {
          event.preventDefault();

          const tarefaVal = document.getElementById("tarefa").value;
          const categoriaVal = document.getElementById("categoria").value;
          const descricaoVal = document.getElementById("descricao").value;
          const checkboxVal = document.getElementById("checkbox");
          const agora = new Date();
          let lembreteVal;

          if (noti === false) {
            lembreteVal = "Sem lembrete";
          } else {
            if (document.getElementById("dataHora").value <= agora.toISOString()) {
              alert("A data e hora do lembrete invalidaas.");
              return;
            }
            lembreteVal = document.getElementById("dataHora").value;
          }

          const estadoVal = checkboxVal.checked ? "Concluído" : "Pendente";

          try {
            await database.updateData(`/tarefas/${userID}/${id}`, {
              estado: estadoVal,
              tarefa: tarefaVal,
              categoria: categoriaVal,
              descricao: descricaoVal,
              lembrar: lembreteVal,
            });

            alert("Tarefa atualizada!");
            window.location.href = "tarefas.html";

          } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            alert("Não foi possível atualizar a tarefa.");
          }
        });
      }

    } else {
      alert("Nenhum utilizador autenticado. Faça o login para poder acessar a esta página.");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  });
});
