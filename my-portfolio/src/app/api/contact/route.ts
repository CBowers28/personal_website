import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const { name, email, message, colorName, colorCode, colorHsl } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const colorBlock = `
    <div style="
      width: 100%;
      height: 80px;
      background: ${colorHsl};
      border-radius: 4px 4px 0 0;
    "></div>
    <div style="
      background: #fff;
      padding: 10px 16px 14px;
      border-radius: 0 0 4px 4px;
      margin-bottom: 24px;
      font-family: monospace;
    ">
      <div style="font-size: 11px; color: #aaa; letter-spacing: 2px;">PANTONE®</div>
      <div style="font-size: 18px; font-weight: bold; color: #1a1a18;">${name.toUpperCase()}</div>
      <div style="font-size: 11px; color: #aaa;">${colorCode} · ${colorName}</div>
    </div>
  `;

    await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: "christopherbowers28@gmail.com",
        subject: `New message from ${name} — ${colorName}`,
        html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #F2EFE4;">
        <p style="font-family: monospace; font-size: 11px; letter-spacing: 3px; color: #9a9088; margin-bottom: 4px;">PORTFOLIO CONTACT</p>
        <h1 style="font-family: 'Georgia', serif; font-size: 28px; margin: 0 0 24px; color: #1a1a18;">New Color Mixed</h1>
        ${colorBlock}
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="font-family: monospace; font-size: 11px; color: #9a9088; letter-spacing: 2px; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); width: 80px;">NAME</td>
            <td style="font-family: Georgia, serif; font-size: 15px; color: #1a1a18; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06);">${name}</td>
          </tr>
          <tr>
            <td style="font-family: monospace; font-size: 11px; color: #9a9088; letter-spacing: 2px; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06);">EMAIL</td>
            <td style="font-family: Georgia, serif; font-size: 15px; color: #1a1a18; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06);"><a href="mailto:${email}" style="color: #1B3F6B;">${email}</a></td>
          </tr>
        </table>
        <p style="font-family: monospace; font-size: 11px; color: #9a9088; letter-spacing: 2px; margin-bottom: 8px;">MESSAGE</p>
        <p style="font-family: Georgia, serif; font-size: 15px; line-height: 1.7; color: #444; font-style: italic; padding: 16px; background: #fff; border-radius: 4px;">${message}</p>
      </div>
    `,
    });

    return NextResponse.json({ ok: true });
}