import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs"; 

let noti= null;

console.clear();
document.addEventListener("DOMContentLoaded", async () => {

  console.log("DOM carregado com sucesso!!!");
  let form = document.getElementById("criarTarefa");

  auth.onAuthStateChanged(async (user) => {
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
      
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const tarefa = document.getElementById("tarefa").value;
        if (!tarefa.trim()) {
          alert("Por favor, insira uma tarefa válida.");
          return;
        }

        let lembrete = document.getElementById("dataHora").value;
        if (!lembrete) {
          lembrete = "Sem lembrete";
        }

        let descricao = document.getElementById("descricao").value;
        if (!descricao.trim()) {
          descricao = "Sem descrição";
        }

        const categoria = document.getElementById("categoria").value.trim();

        const agora = new Date();

        console.log(
          "tarefa:", tarefa,
          "lembrete:", lembrete,
          "categoria:", categoria,
          "descricao:", descricao,
        );

        if (form.id === "criarTarefa") {

          console.log("ID do formulário correto.");

          const query = await database.addData(`/tarefas/${userID}`, {
            tarefa: tarefa,
            categoria: categoria,
            descricao: descricao,
            lembrar: lembrete,
            estado: "Pendente",
            criado_em: agora.toLocaleString("pt-PT"),
            notificado: false,
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
