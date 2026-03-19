import { renderMjml } from "./renderMjml.js";

export function welcomeTemplate({ name }) {
  const mjml = `
<mjml>
  <mj-body background-color="#f5f5f5">
    <mj-section padding="24px">
      <mj-column>
        <mj-text font-size="20px" font-weight="600">Hola ${name}</mj-text>
        <mj-text>Bienvenido a la app</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

  return {
    subject: "Bienvenido",
    html: renderMjml(mjml),
    text: `Hola ${name}, bienvenido`
  };
}
