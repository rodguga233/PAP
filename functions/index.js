const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const moment = require("moment-timezone");

admin.initializeApp();

// 🔐 Secret configurado no Firebase Console
const SENDGRID_KEY = defineSecret("SENDGRID_KEY");

// 🕒 Função agendada — executa a cada minuto
exports.enviarEmailsConclusao = onSchedule(
  {
    schedule: "every 1 minutes",
    region: "us-central1",
    secrets: [SENDGRID_KEY],
  },
  async (event) => {
    const apiKey = SENDGRID_KEY.value();

    // ✅ Verificação do secret
    if (!apiKey || !apiKey.startsWith("SG.")) {
      console.error("❌ Secret SENDGRID_KEY inválido ou não carregado.");
      return null;
    }

    sgMail.setApiKey(apiKey);
    console.log("✅ SendGrid inicializado com sucesso.");

    const db = admin.database();
    const tarefasRef = db.ref("tarefas");
    const usersRef = db.ref("users");

    const snapshot = await tarefasRef.once("value");
    const tarefasPorUser = snapshot.val();
    if (!tarefasPorUser) {
      console.log("Nenhuma tarefa encontrada.");
      return null;
    }

    const agora = moment().tz("Europe/Lisbon");

    for (const userID in tarefasPorUser) {
      const tarefas = tarefasPorUser[userID];
      const userSnap = await usersRef.child(userID).once("value");
      const userData = userSnap.val();
      const email = userData?.email;
      const nome = userData?.nome;

      if (userData?.notificacoes === false || !email) continue;

      for (const tarefaID in tarefas) {
        const tarefa = tarefas[tarefaID];

        if (!tarefa.conclusao || tarefa.conclusao === "Sem data") continue;
        if (tarefa.notificado === true) continue;
        if (tarefa.estado !== "Pendente") continue;

        const horaConclusao = moment.tz(tarefa.conclusao, "Europe/Lisbon");
        if (!horaConclusao.isValid() || horaConclusao.isAfter(agora)) continue;

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

        try {
          await sgMail.send(msg);
          console.log(`Email enviado para ${email} sobre tarefa ${tarefaID}`);
          await tarefasRef.child(`${userID}/${tarefaID}/notificado`).set(true);
        } catch (error) {
          console.error(`Erro ao enviar email para ${email}:`, error.response?.body || error);
        }
      }
    }

    console.log("Execução concluída ✔");
    return null;
  }
);
