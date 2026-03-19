import nodemailer from "nodemailer";
import { domains } from "./config.js";

const transporters = {};

function getTransporter(domain) {
  if (!domains[domain]) {
    throw new Error(`Dominio no configurado: ${domain}`);
  }

  if (!transporters[domain]) {
    transporters[domain] = nodemailer.createTransport(domains[domain]);
  }

  return transporters[domain];
}

export async function sendEmail({
  domain,
  to,
  subject,
  html,
  text
}) {
  const transporter = getTransporter(domain);

  try {
    const info = await transporter.sendMail({
      from: `"${domain}" <${domains[domain].auth.user}>`,
      to,
      subject,
      html,
      text
    });

    console.log("OK:", info.messageId);
    return info;
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  }
}
