import { renderTemplate } from "./renderTemplate.js";

export function purchaseThankYouTemplate({ name, productName, licenseKey }) {
  return {
    subject: "Gracias por tu compra",
    html: renderTemplate("purchaseThankYou", { name, productName, licenseKey }),
    text: `Gracias por tu compra${name ? `, ${name}` : ""}. Tu licencia para ${productName} ya esta lista. Numero de serie: ${licenseKey}`
  };
}
