// scripts/send-bus-info.js
// Envia e-mails automáticos com as informações do ônibus do Workshop PPENGFIS.
// Uso: node scripts/send-bus-info.js ./registration.csv

import fs from "node:fs/promises";
import path from "node:path";
import 'dotenv/config';

const API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || 'VI Workshop <onboarding@resend.dev>';
const REPLY_TO = process.env.REPLY_TO || 'workshop.ppengfis@ufrpe.br';

if (!API_KEY) {
  console.error("Faltou RESEND_API_KEY no .env");
  process.exit(1);
}

const inputPath = process.argv[2] || "./registration.csv";
const absPath = path.resolve(process.cwd(), inputPath);

// ---- Lê CSV básico: email,name ----
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const rows = [];

  for (const l of lines) {
    const [email, name] = l.split(",").map(s => s.trim());
    if (email) rows.push({ email, name });
  }
  return rows;
}

function busHtml(name) {
  const safeName = name || "Participante";

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#111;">
    <p>Olá ${safeName},</p>

    <p>
      Seguem as informações sobre o <strong>ônibus para o Workshop do PPENGFIS</strong>:
    </p>

    <ul>
      <li><strong>Parada 1:</strong> Sede UFRPE (saída 7h00)</li>
      <li><strong>Parada 2:</strong> Reitoria da UFPE</li>
      <li><strong>Parada 3:</strong> Parada da Área II da UFPE</li>
      <li><strong>Parada 4:</strong> Parada do aeroporto (aprox. 7h30)</li>
    </ul>

    <p>
      Por favor, esteja presente com antecedência, pois o ônibus permanecerá 
      <strong>apenas 5 minutos</strong> em cada parada.
    </p>

    <p>
      Atenciosamente,<br/>
      Organização do VI Workshop do PPENGFIS/UFRPE
    </p>
  </div>
  `;
}

const raw = await fs.readFile(absPath, "utf8");
const recipients = parseCSV(raw);

// Delay para evitar throttling
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

for (const r of recipients) {
  const to = r.email.trim();

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
      subject: "Ônibus para o Workshop do PPENGFIS",
      html: busHtml(r.name),
    }),
  });

  if (!res.ok) {
    console.error(`[FAIL] ${to}:`, await res.text());
  } else {
    console.log(`[OK] ${to}`);
  }

  await sleep(400);
}

console.log("Done.");
