import "dotenv/config";
import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import { sendEmail } from "./mailer.js";
import { purchaseThankYouTemplate } from "./templates/purchaseThankYou.js";
import { resetPasswordTemplate } from "./templates/resetPassword.js";
import { welcomeTemplate } from "./templates/welcome.js";

const app = Fastify({ logger: true });

function parseApiKeys() {
  const raw = process.env.EMAIL_API_KEYS || process.env.EMAIL_API_KEY;
  if (!raw) return [];
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

const apiKeys = parseApiKeys();

app.addHook("onRequest", async (req) => {
  if (req.url.startsWith("/health")) return;
  if (apiKeys.length === 0) return;
  const key = req.headers["x-api-key"];
  if (!key || !apiKeys.includes(String(key))) {
    req.log.warn("Unauthorized request");
    return req
      .reply.code(401)
      .send({ error: "Unauthorized", message: "Invalid API key" });
  }
});

await app.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX || 60),
  timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
});

app.post("/send", async (req) => {
  const result = await sendEmail(req.body);
  return result;
});

app.post("/send/welcome", async (req) => {
  const { domain, to, name } = req.body;
  const { subject, html, text } = welcomeTemplate({ name });
  return sendEmail({ domain, to, subject, html, text });
});

app.post("/send/reset-password", async (req) => {
  const { domain, to, name, resetUrl } = req.body;
  const { subject, html, text } = resetPasswordTemplate({ name, resetUrl });
  return sendEmail({ domain, to, subject, html, text });
});

app.post("/send/purchase-thank-you", async (req) => {
  const { domain, to, name, productName, licenseKey } = req.body;
  const { subject, html, text } = purchaseThankYouTemplate({
    name,
    productName,
    licenseKey,
  });
  return sendEmail({ domain, to, subject, html, text });
});

app.get("/health", async () => ({ ok: true }));

const port = Number(process.env.PORT || 3000);
app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`HTTP server listo en http://localhost:${port}`);
});
