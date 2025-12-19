import { database } from "../database/func.mjs";
import { auth } from "../database/db.mjs"; 

console.clear();
document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM carregado com sucesso!!!");
  const form = document.getElementById("criarTarefa");

  // Firebase 8 → auth.onAuthStateChanged
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userID = user.uid;
      console.log("Utilizador autenticado:", userID);

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const tarefa = document.getElementById("tarefa");
        if (!tarefa.value.trim()) {
          alert("Por favor, insira uma tarefa válida.");
          return;
        }

        const descricao = document.getElementById("descricao");
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
