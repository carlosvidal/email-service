import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { welcomeTemplate } from "../templates/welcome.js";
import { resetPasswordTemplate } from "../templates/resetPassword.js";
import { purchaseThankYouTemplate } from "../templates/purchaseThankYou.js";

describe("welcomeTemplate", () => {
  it("returns subject, html, and text", () => {
    const result = welcomeTemplate({ name: "Carlos" });
    assert.equal(result.subject, "Bienvenido");
    assert.ok(result.html.includes("Carlos"));
    assert.ok(result.text.includes("Carlos"));
  });
});

describe("resetPasswordTemplate", () => {
  it("returns subject, html, and text with resetUrl", () => {
    const result = resetPasswordTemplate({
      name: "Carlos",
      resetUrl: "https://example.com/reset/abc",
    });
    assert.ok(result.subject);
    assert.ok(result.html.includes("Carlos"));
    assert.ok(result.html.includes("https://example.com/reset/abc"));
    assert.ok(result.text.includes("https://example.com/reset/abc"));
  });
});

describe("purchaseThankYouTemplate", () => {
  it("returns subject, html, and text with product info", () => {
    const result = purchaseThankYouTemplate({
      name: "Carlos",
      productName: "Pro Plan",
      licenseKey: "LIC-ABC-123",
    });
    assert.ok(result.subject);
    assert.ok(result.html.includes("Carlos"));
    assert.ok(result.html.includes("Pro Plan"));
    assert.ok(result.html.includes("LIC-ABC-123"));
    assert.ok(result.text.includes("Pro Plan"));
  });
});
