import { renderTemplate } from "./renderTemplate.js";

export function resetPasswordTemplate({ name, resetUrl }) {
  return {
    subject: "Restablece tu contrasena",
    html: renderTemplate("resetPassword", { name, resetUrl }),
    text: `Hola ${name}, usa este enlace para restablecer tu contrasena: ${resetUrl}`
  };
}
