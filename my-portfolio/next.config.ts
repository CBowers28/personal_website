import type { NextConfig } from "next";

// ─── Content Security Policy ────────────────────────────────────────
// Locks down where scripts, styles, images, and connections can come from,
// which is the single biggest defense against XSS and injected third-party
// content. Notes on the intentional relaxations:
//   • script-src 'unsafe-inline' — Next.js App Router injects inline
//     hydration/streaming scripts. A nonce-based policy would need per-request
//     middleware and disables static optimization; the XSS surface here is
//     tiny (no user input is ever rendered back into a page — the contact
//     form's only sink is an escaped email), so inline scripts are acceptable.
//   • style-src 'unsafe-inline' — the UI relies heavily on inline style
//     attributes and CSS-in-JS, which require this.
//   • Vercel Analytics is served same-origin in production but falls back to
//     va.vercel-scripts.com, so it's allowlisted for script + connect.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Force HTTPS for two years, including subdomains, and be preload-eligible.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Stop browsers from MIME-sniffing responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy clickjacking guard for browsers that ignore frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  // Send only the origin on cross-origin navigations; nothing on downgrade.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny access to powerful features the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
