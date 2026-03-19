import { renderTemplate } from "./renderTemplate.js";

export function welcomeTemplate({ name }) {
  return {
    subject: "Bienvenido",
    html: renderTemplate("welcome", { name }),
    text: `Hola ${name}, bienvenido`
  };
}
