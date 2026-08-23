import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Anti-spam / abuse hardening ────────────────────────────────────
// Layers (all industry-standard for a public contact form):
//   1. Same-origin check (blocks cross-site scripted POSTs)
//   2. Honeypot field — bots fill hidden inputs; humans never see them
//   3. Time-to-submit floor — instant submits are automated
//   4. Per-IP rate limiting (sliding window, in-memory)
//   5. Strict validation + length caps on every field
//   6. HTML-escaping of all user input before it enters the email body
// A CAPTCHA (Cloudflare Turnstile / hCaptcha) is the natural next layer if
// spam ever gets through — it needs an external key, so it's intentionally
// left out here.

const RATE_LIMIT_MAX = 5;                 // submissions per window per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60_000; // 10 minutes
const MIN_FILL_MS = 2_500;                // faster than this ⇒ almost certainly a bot
const MAX_FORM_AGE_MS = 60 * 60_000;      // stale/replayed form token

const LIMITS = { name: 100, email: 254, message: 4_000, color: 80 };

// In-memory store. Fine for a single serverless instance / low traffic; swap
// for Upstash/Redis if this ever runs multi-instance at scale.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5_000) {
        // opportunistic cleanup so the map can't grow unbounded
        for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
    return recent.length > RATE_LIMIT_MAX;
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
// Only allow the color values our own client produces (hsl(...) or #hex).
const isSafeColor = (s: string) => /^(#[0-9a-fA-F]{3,8}|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\))$/.test(s);

function clientIp(req: NextRequest): string {
    const fwd = req.headers.get("x-forwarded-for");
    return (fwd ? fwd.split(",")[0].trim() : null) || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
    // 1. Same-origin — the form is only ever submitted from this site.
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
        return NextResponse.json({ error: "Bad origin" }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    // 2. Honeypot — a hidden field named `company`. Any value ⇒ bot.
    //    Respond 200 so the bot thinks it succeeded and doesn't retry.
    if (typeof body.company === "string" && body.company.trim() !== "") {
        return NextResponse.json({ ok: true });
    }

    // 3. Time-to-submit floor, using a client-provided render timestamp.
    const renderedAt = Number(body.renderedAt);
    if (Number.isFinite(renderedAt)) {
        const elapsed = Date.now() - renderedAt;
        if (elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
            return NextResponse.json({ ok: true }); // silently drop
        }
    }

    // 4. Rate limit.
    if (rateLimited(clientIp(req))) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 5. Validation + length caps.
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const colorName = String(body.colorName ?? "").trim();
    const colorCode = String(body.colorCode ?? "").trim();
    const colorHsl = String(body.colorHsl ?? "").trim();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (name.length > LIMITS.name || email.length > LIMITS.email ||
        message.length > LIMITS.message || colorName.length > LIMITS.color || colorCode.length > LIMITS.color) {
        return NextResponse.json({ error: "Field too long" }, { status: 400 });
    }
    if (!isEmail(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 6. Escape everything before it touches HTML. Color is validated against a
    //    strict allowlist (it lands in a CSS `background`), then falls back safe.
    const safe = {
        name: escapeHtml(name),
        email: escapeHtml(email),
        message: escapeHtml(message).replace(/\n/g, "<br>"),
        colorName: escapeHtml(colorName),
        colorCode: escapeHtml(colorCode),
        colorHsl: isSafeColor(colorHsl) ? colorHsl : "#C8C0B0",
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    const colorBlock = `
    <div style="width: 100%; height: 80px; background: ${safe.colorHsl}; border-radius: 4px 4px 0 0;"></div>
    <div style="background: #fff; padding: 10px 16px 14px; border-radius: 0 0 4px 4px; margin-bottom: 24px; font-family: monospace;">
      <div style="font-size: 11px; color: #aaa; letter-spacing: 2px;">PANTONE®</div>
      <div style="font-size: 18px; font-weight: bold; color: #1a1a18;">${safe.name.toUpperCase()}</div>
      <div style="font-size: 11px; color: #aaa;">${safe.colorCode} · ${safe.colorName}</div>
    </div>
  `;

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
            to: "christopherbowers28@gmail.com",
            replyTo: email,
            // Strip CR/LF before it reaches a header — defense-in-depth against
            // email header injection (nodemailer also guards this).
            subject: `New message from ${name} · ${colorName}`
                .replace(/[\r\n]+/g, " ")
                .slice(0, 160),
            html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #F2EFE4;">
        <p style="font-family: monospace; font-size: 11px; letter-spacing: 3px; color: #9a9088; margin-bottom: 4px;">PORTFOLIO CONTACT</p>
        <h1 style="font-family: 'Georgia', serif; font-size: 28px; margin: 0 0 24px; color: #1a1a18;">New Color Mixed</h1>
        ${colorBlock}
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="font-family: monospace; font-size: 11px; color: #9a9088; letter-spacing: 2px; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); width: 80px;">NAME</td>
            <td style="font-family: Georgia, serif; font-size: 15px; color: #1a1a18; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06);">${safe.name}</td>
          </tr>
          <tr>
            <td style="font-family: monospace; font-size: 11px; color: #9a9088; letter-spacing: 2px; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06);">EMAIL</td>
            <td style="font-family: Georgia, serif; font-size: 15px; color: #1a1a18; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06);"><a href="mailto:${safe.email}" style="color: #1B3F6B;">${safe.email}</a></td>
          </tr>
        </table>
        <p style="font-family: monospace; font-size: 11px; color: #9a9088; letter-spacing: 2px; margin-bottom: 8px;">MESSAGE</p>
        <p style="font-family: Georgia, serif; font-size: 15px; line-height: 1.7; color: #444; font-style: italic; padding: 16px; background: #fff; border-radius: 4px;">${safe.message}</p>
      </div>
    `,
        });
    } catch (err) {
        console.error("contact sendMail failed:", err);
        return NextResponse.json({ error: "Send failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}
