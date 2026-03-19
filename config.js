import "dotenv/config";
import fs from "node:fs";

function parseDomainsFromJson(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("SMTP_DOMAINS_JSON debe ser un objeto JSON");
    }
    return parsed;
  } catch (err) {
    throw new Error(`SMTP_DOMAINS_JSON invalido: ${err.message}`);
  }
}

function parseDomainsFromFile(path) {
  if (!path) return null;
  if (!fs.existsSync(path)) {
    throw new Error(`SMTP_DOMAINS_FILE no existe: ${path}`);
  }
  const raw = fs.readFileSync(path, "utf8");
  return parseDomainsFromJson(raw);
}

function parseSingleDomainFromEnv() {
  const REQUIRED = [
    "SMTP_DOMAIN",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
  ];

  for (const key of REQUIRED) {
    if (!process.env[key]) {
      return null;
    }
  }

  const secure = process.env.SMTP_SECURE === "true";
  const port = Number(process.env.SMTP_PORT);
  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT debe ser un numero");
  }

  return {
    [process.env.SMTP_DOMAIN]: {
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  };
}

const domainsFile =
  process.env.SMTP_DOMAINS_FILE ||
  (fs.existsSync("domains.json") ? "domains.json" : null);

const domains =
  (domainsFile ? parseDomainsFromFile(domainsFile) : null) ||
  parseDomainsFromJson(process.env.SMTP_DOMAINS_JSON) ||
  parseDomainsFromJson(process.env.SMTP_DOMAINS) ||
  parseSingleDomainFromEnv();

if (!domains) {
  throw new Error(
    "Falta configuracion SMTP. Usa SMTP_DOMAINS_FILE o SMTP_DOMAINS_JSON, o variables SMTP_* para un dominio."
  );
}

export { domains };
