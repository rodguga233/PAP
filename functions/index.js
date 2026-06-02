const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

const SENDGRID_KEY = defineSecret("SENDGRID_KEY");

exports.enviarEmailsConclusao = onSchedule(
  {
    schedule: "every 1 minutes",
    secrets: [SENDGRID_KEY],
  },
  async () => {
    sgMail.setApiKey(SENDGRID_KEY.value());

    const db = admin.database();
    const tarefasRef = db.ref("tarefas");
    const usersRef = db.ref("users");

    const snapshot = await tarefasRef.once("value");
    const tarefasPorUser = snapshot.val();
    if (!tarefasPorUser) return null;

    const agora = Date.now();

    for (const userID in tarefasPorUser) {
      const tarefas = tarefasPorUser[userID];

      const userSnap = await usersRef.child(userID).once("value");
      const userData = userSnap.val();
      const email = userData?.email;
      const nome = userData?.nome;

      // Só envia email se o utilizador tiver notificações ativas
      if (userData?.notificacoes === false) continue;

      if (!email) continue;

      for (const tarefaID in tarefas) {
        const tarefa = tarefas[tarefaID];

        // Agora usa "conclusao"
        if (!tarefa.conclusao || tarefa.conclusao === "Sem data") continue;
        if (tarefa.notificado === true) continue;
        if (tarefa.estado !== "Pendente") continue;

        const horaConclusao = new Date(tarefa.conclusao).getTime();
        if (isNaN(horaConclusao)) continue;

        if (horaConclusao <= agora) {
          const msg = {
            to: email,
            from: "jesurodrigo924@gmail.com",
            subject: `Conclusão: ${tarefa.tarefa}`,
            text: `Olá ${nome || ""}! A data de conclusão chegou:\n\n${tarefa.tarefa}\n\nDescrição: ${tarefa.descricao || ""}`,
            html: `
              <h2>Olá ${nome || ""} 👋</h2>
              <p>A data de conclusão chegou:</p>
              <p><strong>Tarefa:</strong> ${tarefa.tarefa}</p>
              <p><strong>Descrição:</strong> ${tarefa.descricao || "(sem descrição)"}</p>
              <p><strong>Data:</strong> ${tarefa.conclusao}</p>
            `,
          };

          await sgMail.send(msg);
          console.log(`Email enviado para ${email} sobre tarefa ${tarefaID}`);

          await tarefasRef.child(`${userID}/${tarefaID}/notificado`).set(true);
        }
      }
    }

    return null;
  }
);
