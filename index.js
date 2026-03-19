import { sendEmail } from "./mailer.js";
import { welcomeTemplate } from "./templates/welcome.js";

async function main() {
  const { subject, html, text } = welcomeTemplate({ name: "Carlos" });

  await sendEmail({
    domain: "cdr2svg.com",
    to: "juguemos@lapolla.club",
    subject,
    html,
    text
  });

  console.log("Email enviado");
}

main();
