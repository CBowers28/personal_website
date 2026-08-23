// ─── Contact-form validation & sanitization ─────────────────────────
// Pure, dependency-free helpers shared by the /api/contact route and its
// unit tests. Keeping them here (rather than inline in the route) makes the
// anti-abuse logic independently testable — see contact-validation.test.ts.

/** Field length caps applied before anything touches the email body. */
export const LIMITS = { name: 100, email: 254, message: 4_000, color: 80 } as const;

/** Escape the five HTML-significant characters so user input can't inject markup. */
export function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/** Minimal, permissive email shape check (real validation is the reply bouncing). */
export const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/**
 * Only allow the color values our own client produces (`hsl(...)` or `#hex`).
 * The value lands in a CSS `background`, so anything else must be rejected.
 */
export const isSafeColor = (s: string): boolean =>
    /^(#[0-9a-fA-F]{3,8}|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\))$/.test(s);

/**
 * Build a mail `Subject:` from untrusted parts. Strips CR/LF (defense-in-depth
 * against email header injection) and caps the length.
 */
export function sanitizeSubject(name: string, colorName: string): string {
    return `New message from ${name} · ${colorName}`
        .replace(/[\r\n]+/g, " ")
        .slice(0, 160);
}
