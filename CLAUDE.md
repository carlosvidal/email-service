# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A lightweight multi-domain email sending service using Node.js + Nodemailer + MJML templates. Can be used as a library (direct import or npm link) or as an HTTP API (Fastify).

## Commands

```bash
npm run build:templates    # Compile MJML → HTML (required before sending emails)
npm run start              # Run index.js (direct send test)
npm run server             # Start Fastify HTTP API on PORT (default 3000)
npm run watch:templates    # Auto-rebuild MJML on file changes
```

Always run `build:templates` before `start` or `server` — compiled HTML files are gitignored.

## Architecture

- **config.js** — Loads SMTP credentials. Supports three sources (in priority order): `domains.json` file, `SMTP_DOMAINS_JSON` env var, or individual `SMTP_*` env vars for single domain. Exports a `domains` object keyed by domain name.
- **mailer.js** — Exposes `sendEmail({ domain, to, subject, html, text })`. Creates/caches one Nodemailer transporter per domain.
- **server.js** — Fastify HTTP API with API key auth (`X-API-Key` header, keys from `EMAIL_API_KEYS` env) and rate limiting. Routes: `POST /send`, `POST /send/welcome`, `POST /send/reset-password`, `POST /send/purchase-thank-you`, `GET /health`.
- **index.js** — Simple script entry point for direct email sending (used for testing).

### Template Pipeline

1. Write MJML sources in `templates/mjml/` (partials in `templates/mjml/partials/`)
2. `build-templates.js` compiles them to `templates/compiled/*.html` (gitignored)
3. Template modules (`templates/welcome.js`, etc.) use `renderTemplate.js` which reads compiled HTML and applies Handlebars variable substitution
4. Each template module returns `{ subject, html, text }`

## Configuration

- Copy `.env.example` → `.env` and `domains.example.json` → `domains.json`
- `domains.json` is gitignored — contains SMTP credentials per domain
- ES modules throughout (`"type": "module"` in package.json)
- OpenAPI spec at `openapi.yaml`
