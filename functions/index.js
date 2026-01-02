const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// Secret do SendGrid
const SENDGRID_KEY = defineSecret("SENDGRID_KEY");

exports.enviarEmailsLembretes = onSchedule(
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

      if (!email) continue;

      for (const tarefaID in tarefas) {
        const tarefa = tarefas[tarefaID];

        if (!tarefa.lembrar || tarefa.lembrar === "Sem lembrete") continue;
        if (tarefa.notificado === true) continue;

        const horaLembrete = new Date(tarefa.lembrar).getTime();
        if (isNaN(horaLembrete)) continue;

        if (horaLembrete <= agora) {
          const msg = {
            to: email,
            from: "jesurodrigo924@gmail.com",
            subject: `Lembrete: ${tarefa.tarefa}`,
            text: `Olá ${nome || ""}! Tens um lembrete:\n\n${tarefa.tarefa}\n\nDescrição: ${tarefa.descricao || ""}`,
            html: `
              <h2>Olá ${nome || ""} 👋</h2>
              <p>Tens um lembrete:</p>
              <p><strong>Tarefa:</strong> ${tarefa.tarefa}</p>
              <p><strong>Descrição:</strong> ${tarefa.descricao || "(sem descrição)"}</p>
              <p><strong>Data:</strong> ${tarefa.lembrar}</p>
            `
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
