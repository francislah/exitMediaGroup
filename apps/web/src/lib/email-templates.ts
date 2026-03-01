export function getConfirmationEmailHtml(
  locale: "fr" | "en",
  name: string,
): string {
  const isFr = locale === "fr";
  const title = isFr ? "Merci pour votre message" : "Thank you for your message";
  const body = isFr
    ? `Bonjour ${name}, nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.`
    : `Hello ${name}, we have received your message and will get back to you as soon as possible.`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f6f8ff;color:#111;">
  <div style="max-width:560px;margin:0 auto;padding:2rem;">
    <h1 style="font-size:1.5rem;margin:0 0 1rem;">${title}</h1>
    <p style="line-height:1.6;margin:0;">${body}</p>
    <p style="margin-top:2rem;font-size:0.875rem;color:#666;">
      Exit Media Group
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function getInternalNotificationHtml(
  name: string,
  email: string,
  message: string,
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:system-ui,sans-serif;background:#f6f8ff;color:#111;">
  <div style="max-width:560px;margin:0 auto;padding:2rem;">
    <h1 style="font-size:1.25rem;margin:0 0 1rem;">New contact form submission</h1>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:0.5rem 0;font-weight:600;width:80px;">Name</td>
        <td style="padding:0.5rem 0;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:0.5rem 0;font-weight:600;">Email</td>
        <td style="padding:0.5rem 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
      </tr>
      <tr>
        <td style="padding:0.5rem 0;font-weight:600;vertical-align:top;">Message</td>
        <td style="padding:0.5rem 0;white-space:pre-wrap;">${escapeHtml(message)}</td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
