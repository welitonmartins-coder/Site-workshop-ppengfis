import { Resend } from "resend";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCertificateLinks(jsonPath) {
  const raw = await fs.readFile(jsonPath, "utf-8");
  const list = JSON.parse(raw);

  if (!process.env.CERT_BASE_URL) {
    console.error("❌ Falta CERT_BASE_URL no .env");
    process.exit(1);
  }
  if (!process.env.FROM_EMAIL) {
    console.error("❌ Falta FROM_EMAIL no .env");
    process.exit(1);
  }

  console.log(`Encontrados ${list.length} registros em ${jsonPath}`);

  let count = 0;
  for (const entry of list) {
    const name = (entry.name || "").trim();
    const email = (entry.email || "").trim();

    if (!name || !email) {
      console.error("⚠️ Registro inválido (sem nome ou e-mail):", entry);
      continue;
    }

    const fileName = entry.file
      ? entry.file
      : `certificado_workshop_${name}.pdf`;

    const certUrl = `${process.env.CERT_BASE_URL}/${encodeURIComponent(
      fileName
    )}`;

    console.log(`📤 [PARTICIPAÇÃO] Enviando para: ${email} → ${certUrl}`);

    try {
      const { error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: `${name} <${email}>`,
        subject:
          "Link para download do seu certificado – VI Workshop PPENGFIS",
        html: `
          <p>Olá, ${name},</p>
          <p>Seu certificado de participação no
          <strong>VI International Workshop of the Graduate Program on Physics Engineering (PPENGFIS)</strong>
          já está disponível para download.</p>

          <p><a href="${certUrl}" target="_blank">${certUrl}</a></p>

          <p>Recomendamos que você baixe e salve o arquivo em um local seguro.</p>

          <p>Atenciosamente,<br>
          Comissão Organizadora do VI Workshop PPENGFIS</p>
        `,
        text: `
Olá, ${name},

Seu certificado de participação no VI International Workshop of the Graduate Program on Physics Engineering (PPENGFIS) já está disponível para download.

Acesse o link:
${certUrl}

Atenciosamente,
Comissão Organizadora do VI Workshop PPENGFIS
        `.trim(),
      });

      if (error) {
        console.error("❌ Erro ao enviar para:", email, error);
      } else {
        console.log("✔ Enviado (participação):", email);
      }
    } catch (err) {
      console.error("🔥 Erro inesperado (participação):", email, err);
    }

    count += 1;
    // Respeitar limite do Resend: máx. 2 req/s → usamos 1 e-mail/s
    await wait(1000);
  }

  console.log(`✅ Finalizado: ${count} e-mails de PARTICIPAÇÃO processados.`);
}

const inputFile = process.argv[2] || "certificados_list.json";

sendCertificateLinks(inputFile).catch((err) => {
  console.error("🔥 Erro geral ao enviar certificados de participação:", err);
  process.exit(1);
});