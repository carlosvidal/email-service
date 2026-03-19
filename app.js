import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import { sendEmail as defaultSendEmail } from "./mailer.js";
import { purchaseThankYouTemplate } from "./templates/purchaseThankYou.js";
import { resetPasswordTemplate } from "./templates/resetPassword.js";
import { welcomeTemplate } from "./templates/welcome.js";

const domainAndTo = {
  domain: { type: "string", minLength: 1 },
  to: { type: "string", minLength: 3 },
};

const sendSchema = {
  body: {
    type: "object",
    required: ["domain", "to", "subject"],
    properties: {
      ...domainAndTo,
      subject: { type: "string", minLength: 1 },
      html: { type: "string" },
      text: { type: "string" },
    },
    additionalProperties: false,
  },
};

const sendWelcomeSchema = {
  body: {
    type: "object",
    required: ["domain", "to", "name"],
    properties: {
      ...domainAndTo,
      name: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};

const sendResetPasswordSchema = {
  body: {
    type: "object",
    required: ["domain", "to", "name", "resetUrl"],
    properties: {
      ...domainAndTo,
      name: { type: "string", minLength: 1 },
      resetUrl: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};

const sendPurchaseSchema = {
  body: {
    type: "object",
    required: ["domain", "to", "name", "productName", "licenseKey"],
    properties: {
      ...domainAndTo,
      name: { type: "string", minLength: 1 },
      productName: { type: "string", minLength: 1 },
      licenseKey: { type: "string", minLength: 1 },
    },
    additionalProperties: false,
  },
};

function parseApiKeys() {
  const raw = process.env.EMAIL_API_KEYS || process.env.EMAIL_API_KEY;
  if (!raw) return [];
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export async function buildApp(opts = {}) {
  const sendEmail = opts.sendEmail || defaultSendEmail;
  const app = Fastify({ logger: opts.logger ?? true });

  const apiKeys = parseApiKeys();

  app.addHook("onRequest", async (req, reply) => {
    if (req.url.startsWith("/health")) return;
    if (apiKeys.length === 0) return;
    const key = req.headers["x-api-key"];
    if (!key || !apiKeys.includes(String(key))) {
      req.log.warn("Unauthorized request");
      return reply
        .code(401)
        .send({ error: "Unauthorized", message: "Invalid API key" });
    }
  });

  await app.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX || 60),
    timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
  });

  app.post("/send", { schema: sendSchema }, async (req) => {
    return sendEmail(req.body);
  });

  app.post("/send/welcome", { schema: sendWelcomeSchema }, async (req) => {
    const { domain, to, name } = req.body;
    const { subject, html, text } = welcomeTemplate({ name });
    return sendEmail({ domain, to, subject, html, text });
  });

  app.post(
    "/send/reset-password",
    { schema: sendResetPasswordSchema },
    async (req) => {
      const { domain, to, name, resetUrl } = req.body;
      const { subject, html, text } = resetPasswordTemplate({
        name,
        resetUrl,
      });
      return sendEmail({ domain, to, subject, html, text });
    }
  );

  app.post(
    "/send/purchase-thank-you",
    { schema: sendPurchaseSchema },
    async (req) => {
      const { domain, to, name, productName, licenseKey } = req.body;
      const { subject, html, text } = purchaseThankYouTemplate({
        name,
        productName,
        licenseKey,
      });
      return sendEmail({ domain, to, subject, html, text });
    }
  );

  app.get("/health", async () => ({ ok: true }));

  return app;
}
