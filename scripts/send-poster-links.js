import { Resend } from "resend";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPosterCertificates(jsonPath) {
  const raw = await fs.readFile(jsonPath, "utf-8");
  const list = JSON.parse(raw);

  if (!process.env.CERT_POSTER_BASE_URL) {
    console.error("❌ Falta CERT_POSTER_BASE_URL no .env");
    process.exit(1);
  }

  for (const entry of list) {
    const name = entry.name.trim();
    const email = entry.email.trim();

    // monta o nome do arquivo
    const fileName = entry.file
      ? entry.file
      : `certificado_poster_${name}.pdf`;

    const certUrl = `${process.env.CERT_POSTER_BASE_URL}/${encodeURIComponent(
      fileName
    )}`;

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: `${name} <${email}>`,
        subject: "Certificado de Pôster – VI Workshop PPENGFIS",
        html: `
          <p>Olá, ${name},</p>
          <p>Seu certificado de <strong>apresentação de pôster</strong> no
          VI International Workshop of the Graduate Program on Physics Engineering – PPENGFIS
          já está disponível para download.</p>

          <p><a href="${certUrl}" target="_blank">${certUrl}</a></p>

          <p>Atenciosamente,<br>Comissão Organizadora</p>
        `,
        text: `
Olá, ${name},

Seu certificado de apresentação de pôster no VI Workshop PPENGFIS está disponível no link abaixo:

${certUrl}

Atenciosamente,
Comissão Organizadora
        `.trim(),
      });

      if (error) {
        console.error("❌ Erro ao enviar para:", email, error);
      } else {
        console.log("✔ Enviado para:", email);
      }
    } catch (err) {
      console.error("🔥 Falha inesperada ao enviar para:", email, err);
    }
  }
}

const inputFile = process.argv[2] || "certificados_poster_list.json";
sendPosterCertificates(inputFile);
