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
npm run start
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
```

## API HTTP (opcional)

```bash
npm run server
```

Ejemplo de request:

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "tu-dominio.com",
    "to": "destino@correo.com",
    "subject": "Hola",
    "html": "<h1>Hola</h1>",
    "text": "Hola"
  }'
```

## Estructura

```
email-service/
├── index.js
├── mailer.js
├── config.js
├── server.js
└── templates/
    ├── renderMjml.js
    ├── welcome.js
    └── resetPassword.js
```

## Notas

- El dominio usado en `sendEmail` debe existir en `domains.json` o en el `.env`.
- Los templates usan MJML y se compilan a HTML en runtime.
