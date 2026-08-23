import { describe, it, expect } from "vitest";
import { LIMITS, escapeHtml, isEmail, isSafeColor, sanitizeSubject } from "./contact-validation";

describe("escapeHtml", () => {
    it("escapes all five HTML-significant characters", () => {
        expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
    });

    it("neutralizes a script-tag injection attempt", () => {
        expect(escapeHtml('<script>alert("x")</script>')).toBe(
            "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
        );
    });

    it("escapes ampersands first so entities aren't double-broken", () => {
        // If & were escaped after <, we'd get &amp;lt; — verify the ordering.
        expect(escapeHtml("<")).toBe("&lt;");
        expect(escapeHtml("&lt;")).toBe("&amp;lt;");
    });

    it("leaves ordinary text untouched", () => {
        expect(escapeHtml("Hello, world 123")).toBe("Hello, world 123");
    });
});

describe("isEmail", () => {
    it.each([
        "a@b.co",
        "chris.bowers@example.com",
        "user+tag@sub.domain.org",
    ])("accepts %s", (addr) => {
        expect(isEmail(addr)).toBe(true);
    });

    it.each([
        "",
        "no-at-sign",
        "missing@domain",
        "@no-local.com",
        "spaces in@email.com",
        "double@@at.com",
    ])("rejects %s", (addr) => {
        expect(isEmail(addr)).toBe(false);
    });
});

describe("isSafeColor", () => {
    it.each([
        "#fff",
        "#FFFFFF",
        "#12ab34cd",
        "hsl(210, 40%, 50%)",
        "hsl(0,0%,0%)",
    ])("accepts client-produced color %s", (color) => {
        expect(isSafeColor(color)).toBe(true);
    });

    it.each([
        "red",
        "rgb(1,2,3)",
        "#12",
        "url(x)",
        "hsl(210, 40%, 50%); background: url(evil)",
        "expression(alert(1))",
    ])("rejects unsafe color %s", (color) => {
        expect(isSafeColor(color)).toBe(false);
    });
});

describe("sanitizeSubject", () => {
    it("builds the expected subject line", () => {
        expect(sanitizeSubject("Ada", "Electric Blue")).toBe(
            "New message from Ada · Electric Blue",
        );
    });

    it("strips CR/LF to prevent email header injection", () => {
        const subject = sanitizeSubject("Ada\r\nBcc: victim@example.com", "Blue");
        expect(subject).not.toMatch(/[\r\n]/);
    });

    it("caps the subject length at 160 characters", () => {
        const subject = sanitizeSubject("x".repeat(500), "y".repeat(500));
        expect(subject.length).toBe(160);
    });
});

describe("LIMITS", () => {
    it("keeps email within the RFC 5321 maximum", () => {
        expect(LIMITS.email).toBe(254);
    });

    it("exposes a cap for every user-supplied field", () => {
        expect(Object.keys(LIMITS).sort()).toEqual(["color", "email", "message", "name"]);
    });
});
