import { renderMjml } from "./renderMjml.js";

export function resetPasswordTemplate({ name, resetUrl }) {
  const mjml = `
<mjml>
  <mj-body background-color="#f5f5f5">
    <mj-section padding="24px">
      <mj-column>
        <mj-text font-size="20px" font-weight="600">Hola ${name}</mj-text>
        <mj-text>Usa este enlace para restablecer tu contrasena:</mj-text>
        <mj-button background-color="#111827" color="#ffffff" href="${resetUrl}">
          Restablecer
        </mj-button>
        <mj-text font-size="12px" color="#6b7280">${resetUrl}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

  return {
    subject: "Restablece tu contrasena",
    html: renderMjml(mjml),
    text: `Hola ${name}, usa este enlace para restablecer tu contrasena: ${resetUrl}`
  };
}
