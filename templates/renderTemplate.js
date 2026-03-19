import fs from "node:fs";
import Handlebars from "handlebars";

const compiledDirUrl = new URL("./compiled/", import.meta.url);

export function renderTemplate(name, vars = {}) {
  const fileUrl = new URL(`./compiled/${name}.html`, compiledDirUrl);
  if (!fs.existsSync(fileUrl)) {
    throw new Error(
      `Template compilado no encontrado: ${name}. Ejecuta \"npm run build:templates\".`
    );
  }

  const html = fs.readFileSync(fileUrl, "utf8");
  const template = Handlebars.compile(html, { noEscape: true });
  return template(vars);
}
