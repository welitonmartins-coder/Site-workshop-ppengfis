// netlify/functions/submission-created.js
// Envia e-mail automático via Resend quando um formulário Netlify é enviado.
// Suporta os forms: "abstract" e "registration".
// Requer variáveis de ambiente no Netlify:
//   RESEND_API_KEY  (obrigatória)
//   MAIL_FROM       (ex.: "VI Workshop <onboarding@resend.dev>" ou domínio verificado)
//   REPLY_TO        (ex.: "workshop.ppengfis@ufrpe.br")

export async function handler(event) {
  try {
    const { payload } = JSON.parse(event.body || "{}");
    const formName = payload?.form_name;
    const data = payload?.data || {};
    const to = (data.email || "").trim();

    if (!formName || !to) {
      // Sem nome do form ou sem e-mail do participante: ignorar com sucesso
      return { statusCode: 200, body: "ignored" };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.MAIL_FROM || "VI WorkshopPPENGFIS <workshop@welitonprojetos.com>";
    const REPLY_TO = process.env.REPLY_TO || "workshop.ppengfis@ufrpe.br";

    // Helpers de formatação (escapes simples e fallback)
    const val = (x, fb = "—") => (x && String(x).trim()) || fb;
    const slice = (x, n) => (x ? String(x).slice(0, n) : "");

    let subject = "";
    let html = "";

    if (formName === "abstract") {
      // Campos novos do Abstract
      const name = val(data.name);
      const email = val(data.email);
      const department = val(data.department_program);
      const status = val(data.academic_status);
      const authors = val(data.authors);
      const affiliations = val(data.affiliations);
      const field = val(data.research_field);
      const title = val(data.title);
      const abstractText = val(data.abstract, "");

      subject = "Abstract received – VI Workshop (PPENGFIS)";
      html = `
        <p>Hello ${name || "participant"},</p>
        <p>We have received your <strong>abstract submission</strong> for the
        <strong>VI International Workshop – PPENGFIS</strong>.</p>

        <h3 style="margin:16px 0 6px 0;">Submission details</h3>
        <ul style="margin:0; padding-left:18px;">
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Department / Graduate Program:</strong> ${department}</li>
          <li><strong>Current Position / Academic Status:</strong> ${status}</li>
          <li><strong>Authors and Co-authors:</strong> ${authors}</li>
          <li><strong>Affiliations:</strong> ${affiliations}</li>
          <li><strong>Thematic Area / Research Field:</strong> ${field}</li>
          <li><strong>Title:</strong> ${title}</li>
        </ul>

        <h3 style="margin:16px 0 6px 0;">Abstract</h3>
        <div style="white-space:pre-wrap; font-family:system-ui, Arial, sans-serif; line-height:1.5;">
          ${slice(abstractText, 2000)}
        </div>

        <p style="margin-top:16px;">We will review it and contact you by e-mail. If you have questions, just reply to this message.</p>
        <p>Best regards,<br/>Organizing Committee – PPENGFIS/UFRPE</p>
      `;

    } else if (formName === "registration") {
      const name = val(data.name);
      subject = "Registration received – VI Workshop (PPENGFIS)";
      html = `
        <p>Hello ${name || "participant"},</p>
        <p>We have received your <strong>registration</strong> for the
        <strong>VI International Workshop – PPENGFIS</strong>.</p>
        <p>We will contact you with updates. If you have questions, just reply to this message.</p>
        <p>Best regards,<br/>Organizing Committee – PPENGFIS/UFRPE</p>
      `;

    } else {
      // Outros formulários: ignorar
      return { statusCode: 200, body: "ignored" };
    }

    // Envio via Resend
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject,
        html,
        reply_to: REPLY_TO,
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Resend error:", errorText);
      return { statusCode: 500, body: JSON.stringify({ error: errorText }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
