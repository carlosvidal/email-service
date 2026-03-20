import nodemailer from "nodemailer";
import { domains } from "./config.js";
import { sendViaAhaSend } from "./ahasend.js";

const transporters = {};

function getSmtpTransporter(domain) {
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
  const config = domains[domain];
  if (!config) {
    throw new Error(`Dominio no configurado: ${domain}`);
  }

  try {
    let info;

    if (config.transport === "ahasend") {
      info = await sendViaAhaSend(config, { to, subject, html, text });
    } else {
      // Default: SMTP via nodemailer
      const transporter = getSmtpTransporter(domain);
      info = await transporter.sendMail({
        from: `"${domain}" <${config.auth.user}>`,
        to,
        subject,
        html,
        text
      });
    }

    console.log("OK:", info.messageId);
    return info;
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  }
}
