import { Resend } from "resend";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendCertificateLinks(jsonPath) {
  const raw = await fs.readFile(jsonPath, "utf-8");
  const list = JSON.parse(raw);

  if (!process.env.CERT_BASE_URL) {
    console.error("❌ Falta CERT_BASE_URL no .env");
    process.exit(1);
  }

  for (const entry of list) {
    const name = entry.name.trim();
    const email = entry.email.trim();

    // Monta o nome do arquivo a partir do nome do participante
    const fileName = entry.file
      ? entry.file
      : `certificado_workshop_${name}.pdf`;

    // Monta a URL codificada (para lidar com espaços/acentos)
    const certUrl = `${process.env.CERT_BASE_URL}/${encodeURIComponent(
      fileName
    )}`;

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: `${name} <${email}>`,
        subject: "Link para download do seu certificado – VI Workshop PPENGFIS",
        html: `
          <p>Olá, ${name},</p>
          <p>Seu certificado de participação no
          <strong>VI International Workshop of the Graduate Program on Physics Engineering (PPENGFIS)</strong>
          já está disponível para download.</p>

          <p>Você pode acessar o certificado pelo link abaixo:</p>

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
        console.log("✔ Link enviado para:", email);
      }
    } catch (err) {
      console.error("🔥 Falha inesperada ao enviar para:", email, err);
    }
  }
}

const inputFile = process.argv[2] || "certificados_list.json";
sendCertificateLinks(inputFile);
