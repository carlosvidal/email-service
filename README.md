# Mini Email Service

Servicio simple para enviar emails con SMTP desde multiples proyectos.

## Requisitos

- Node.js 18+ (probado en Node 22)
- Credenciales SMTP por dominio

## Instalacion

Desde este repo:

```bash
cd /Users/carlosvidal/www/mini-resend/email-service
npm install
```

## Configuracion (.env + dotenv)

Copia el ejemplo:

```bash
cp .env.example .env
```

Edita `.env` y elige una de estas opciones:

Opcion A: Multi-dominio (recomendado). Usa archivo JSON:

```bash
SMTP_DOMAINS_FILE=domains.json
```

Copia y edita:

```bash
cp domains.example.json domains.json
```

Opcion B: Un solo dominio:

```bash
SMTP_DOMAIN=tu-dominio.com
SMTP_HOST=smtp.migadu.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=no-reply@tu-dominio.com
SMTP_PASS=TU_PASSWORD
```

No necesitas `source .env` porque usamos `dotenv` automaticamente.

## Uso directo (en este repo)

```bash
npm run build:templates
npm run start
```

## Watch de templates

```bash
npm run watch:templates
```

## Usarlo desde otro proyecto

Opcion A: Import directo por ruta local (simple y rapido)

En el proyecto cliente:

```js
import { sendEmail } from "/Users/carlosvidal/www/mini-resend/email-service/mailer.js";
import { welcomeTemplate } from "/Users/carlosvidal/www/mini-resend/email-service/templates/welcome.js";

const { subject, html, text } = welcomeTemplate({ name: "Carlos" });

await sendEmail({
  domain: "tu-dominio.com",
  to: "destino@correo.com",
  subject,
  html,
  text
});
```

Opcion B: Link local con npm (recomendado si lo vas a reutilizar mucho)

En el servicio:

```bash
cd /Users/carlosvidal/www/mini-resend/email-service
npm link
```

En el proyecto cliente:

```bash
npm link mini-email-service
```

Luego en tu codigo:

```js
import { sendEmail } from "mini-email-service/mailer.js";
import { welcomeTemplate } from "mini-email-service/templates/welcome.js";
import { purchaseThankYouTemplate } from "mini-email-service/templates/purchaseThankYou.js";
```

## API HTTP (opcional)

```bash
npm run build:templates
npm run server
```

Ejemplo de request:

```bash
curl -X POST http://localhost:3000/send \
  -H "X-API-Key: dev-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "tu-dominio.com",
    "to": "destino@correo.com",
    "subject": "Hola",
    "html": "<h1>Hola</h1>",
    "text": "Hola"
  }'
```

Endpoints disponibles:
- `POST /send` (raw)
- `POST /send/welcome`
- `POST /send/reset-password`
- `POST /send/purchase-thank-you`
- `GET /health`

Especificacion OpenAPI: `/Users/carlosvidal/www/mini-resend/email-service/openapi.yaml`

## Estructura

```
email-service/
├── index.js
├── mailer.js
├── config.js
├── server.js
├── scripts/
│   └── build-templates.js
└── templates/
    ├── renderTemplate.js
    ├── compiled/
    ├── mjml/
    │   ├── partials/
    │   │   ├── footer.mjml
    │   │   └── header.mjml
    │   ├── resetPassword.mjml
    │   └── welcome.mjml
    ├── welcome.js
    └── resetPassword.js
```

## Notas

- El dominio usado en `sendEmail` debe existir en `domains.json` o en el `.env`.
- Los templates usan MJML y se precompilan con `npm run build:templates`.
- Las variables usan Handlebars (ej: `{{name}}`, `{{resetUrl}}`).
- Template de compra: `purchaseThankYouTemplate({ name, productName, licenseKey })`.
- Si defines `EMAIL_API_KEYS`, la API exige `X-API-Key` (una de las keys).
- Rate limit via `RATE_LIMIT_MAX` y `RATE_LIMIT_WINDOW`.
