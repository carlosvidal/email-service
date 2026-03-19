import mjml2html from "mjml";

export function renderMjml(mjml) {
  const { html, errors } = mjml2html(mjml, { validationLevel: "soft" });
  if (errors && errors.length > 0) {
    const message = errors.map((e) => e.formattedMessage).join("\n");
    throw new Error(`MJML error:\n${message}`);
  }
  return html;
}
