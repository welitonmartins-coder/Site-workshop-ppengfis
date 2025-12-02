// scripts/send-acceptance.js
// Envia e-mails de aceite de pôster usando a API do Resend.
// Uso: node scripts/send-acceptance.js ./approved_posters.json

import fs from "node:fs/promises";
import path from "node:path";
import 'dotenv/config'; // carrega .env

const API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || 'VI Workshop <onboarding@resend.dev>';
const REPLY_TO = process.env.REPLY_TO || 'workshop.ppengfis@ufrpe.br';

if (!API_KEY) {
  console.error("Faltou RESEND_API_KEY no .env");
  process.exit(1);
}

const inputPath = process.argv[2] || "./approved_posters.json";
const absPath = path.resolve(process.cwd(), inputPath);
const raw = await fs.readFile(absPath, "utf8");
const recipients = JSON.parse(raw);

// Pequeno atraso entre envios (evita throttling)
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function buildHtml({ name, title }) {
  const safeName = name || "Participant";
  const safeTitle = title || "your submission";

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#111;">
    <p>Hello ${safeName},</p>
    <p>
      We are pleased to inform you that your work
      <strong>${safeTitle}</strong> was <strong>accepted</strong> for the
      <strong>Poster Session</strong> at the
      <strong>VI International Workshop of the Graduate Program on Physics Engineering (PPENGFIS/UFRPE)</strong>.
    </p>

    <p><strong>Next steps:</strong></p>
    <ul>
      <li>Prepare your poster (A0 portrait recommended, English).</li>
      <li>Poster session details will be announced on the website shortly.</li>
    </ul>

    <p>If you have questions, just reply to this e-mail.</p>

    <p>Best regards,<br/>
    Organizing Committee – PPENGFIS/UFRPE</p>
  </div>
  `;
}

for (const r of recipients) {
  const to = (r.email || "").trim();
  if (!to) continue;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to,
      reply_to: REPLY_TO,
      subject: "Poster acceptance – VI Workshop (PPENGFIS)",
      html: buildHtml({ name: r.name, title: r.title }),
    }),
  });

  if (!res.ok) {
    const errTxt = await res.text();
    console.error(`[FAIL] ${to}: ${errTxt}`);
  } else {
    console.log(`[OK] ${to}`);
  }

  await sleep(400); // ~0.4s entre envios
}

console.log("Done.");
