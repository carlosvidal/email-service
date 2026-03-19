import { sendEmail } from "./mailer.js";
import { welcomeTemplate } from "./templates/welcome.js";
import { purchaseThankYouTemplate } from "./templates/purchaseThankYou.js";

async function main() {
  const { subject, html, text } = purchaseThankYouTemplate({
    name: "Carlos",
    productName: "Mi Producto Pro",
    licenseKey: "LIC-ABC-123-XYZ"
  });

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
