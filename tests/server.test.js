import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Set dummy SMTP config so config.js doesn't throw
process.env.SMTP_DOMAIN = "test.com";
process.env.SMTP_HOST = "localhost";
process.env.SMTP_PORT = "587";
process.env.SMTP_SECURE = "false";
process.env.SMTP_USER = "test@test.com";
process.env.SMTP_PASS = "test";

const { buildApp } = await import("../app.js");

function mockSendEmail(args) {
  return Promise.resolve({ messageId: "mock-id", ...args });
}

let app;

beforeEach(async () => {
  app = await buildApp({ sendEmail: mockSendEmail, logger: false });
});

describe("GET /health", () => {
  it("returns 200 with ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { ok: true });
  });
});

describe("POST /send", () => {
  it("succeeds with valid body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send",
      payload: {
        domain: "test.com",
        to: "user@example.com",
        subject: "Hello",
        html: "<p>Hi</p>",
      },
    });
    assert.equal(res.statusCode, 200);
  });

  it("returns 400 when domain is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send",
      payload: { to: "user@example.com", subject: "Hello" },
    });
    assert.equal(res.statusCode, 400);
  });

  it("returns 400 when subject is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send",
      payload: { domain: "test.com", to: "user@example.com" },
    });
    assert.equal(res.statusCode, 400);
  });

});

describe("POST /send/welcome", () => {
  it("succeeds with valid body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send/welcome",
      payload: { domain: "test.com", to: "user@example.com", name: "Carlos" },
    });
    assert.equal(res.statusCode, 200);
  });

  it("returns 400 when name is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send/welcome",
      payload: { domain: "test.com", to: "user@example.com" },
    });
    assert.equal(res.statusCode, 400);
  });
});

describe("POST /send/reset-password", () => {
  it("succeeds with valid body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send/reset-password",
      payload: {
        domain: "test.com",
        to: "user@example.com",
        name: "Carlos",
        resetUrl: "https://example.com/reset/abc",
      },
    });
    assert.equal(res.statusCode, 200);
  });

  it("returns 400 when resetUrl is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send/reset-password",
      payload: { domain: "test.com", to: "user@example.com", name: "Carlos" },
    });
    assert.equal(res.statusCode, 400);
  });
});

describe("POST /send/purchase-thank-you", () => {
  it("succeeds with valid body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send/purchase-thank-you",
      payload: {
        domain: "test.com",
        to: "user@example.com",
        name: "Carlos",
        productName: "Pro",
        licenseKey: "LIC-123",
      },
    });
    assert.equal(res.statusCode, 200);
  });

  it("returns 400 when licenseKey is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/send/purchase-thank-you",
      payload: {
        domain: "test.com",
        to: "user@example.com",
        name: "Carlos",
        productName: "Pro",
      },
    });
    assert.equal(res.statusCode, 400);
  });
});

describe("API key auth", () => {
  it("returns 401 when API key is required but missing", async () => {
    process.env.EMAIL_API_KEYS = "secret-key-1";
    const authedApp = await buildApp({
      sendEmail: mockSendEmail,
      logger: false,
    });

    const res = await authedApp.inject({
      method: "POST",
      url: "/send",
      payload: {
        domain: "test.com",
        to: "user@example.com",
        subject: "Hello",
        html: "<p>Hi</p>",
      },
    });
    assert.equal(res.statusCode, 401);
    delete process.env.EMAIL_API_KEYS;
  });

  it("succeeds with valid API key", async () => {
    process.env.EMAIL_API_KEYS = "secret-key-1";
    const authedApp = await buildApp({
      sendEmail: mockSendEmail,
      logger: false,
    });

    const res = await authedApp.inject({
      method: "POST",
      url: "/send",
      headers: { "x-api-key": "secret-key-1" },
      payload: {
        domain: "test.com",
        to: "user@example.com",
        subject: "Hello",
        html: "<p>Hi</p>",
      },
    });
    assert.equal(res.statusCode, 200);
    delete process.env.EMAIL_API_KEYS;
  });

  it("health endpoint skips auth", async () => {
    process.env.EMAIL_API_KEYS = "secret-key-1";
    const authedApp = await buildApp({
      sendEmail: mockSendEmail,
      logger: false,
    });

    const res = await authedApp.inject({ method: "GET", url: "/health" });
    assert.equal(res.statusCode, 200);
    delete process.env.EMAIL_API_KEYS;
  });
});
