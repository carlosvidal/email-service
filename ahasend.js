/**
 * AhaSend HTTP API transport (v2)
 * Alternative to SMTP when outbound SMTP ports are blocked.
 *
 * Config per domain:
 * {
 *   "transport": "ahasend",
 *   "ahasend_account_id": "...",
 *   "ahasend_api_key": "aha-sk-...",
 *   "from_email": "no-reply@cdr2svg.com",
 *   "from_name": "CDR2SVG"
 * }
 */

const BASE_URL = "https://api.ahasend.com/v2";

export async function sendViaAhaSend(config, { to, subject, html, text }) {
  const url = `${BASE_URL}/accounts/${config.ahasend_account_id}/messages`;

  const body = {
    from: {
      email: config.from_email,
      name: config.from_name || config.from_email,
    },
    recipients: [{ email: to }],
    subject,
  };

  if (html) body.html_content = html;
  if (text) body.text_content = text;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.ahasend_api_key}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AhaSend error ${response.status}: ${err}`);
  }

  const result = await response.json();
  const messageId = result.data?.[0]?.id || "unknown";
  return { messageId };
}
