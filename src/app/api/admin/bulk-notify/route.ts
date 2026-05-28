import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user && (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { recipients, subject, message, type } = await req.json();
    // recipients: [{ email, name }]

    if (!recipients?.length) {
      return NextResponse.json({ error: "No recipients" }, { status: 400 });
    }

    const BATCH_SIZE = 5;
    const DELAY_MS = 1000;
    let sent = 0;
    let failed = 0;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      if (i > 0) await new Promise((r) => setTimeout(r, DELAY_MS));
      const batch = recipients.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (r: { email: string; name: string }) => {
          try {
            await transporter.sendMail({
              from: `"Zarlaa Shop" <${process.env.SMTP_USER}>`,
              to: r.email,
              subject,
              html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f9fafb;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <div style="background:#f97316;padding:24px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:20px;">Zarlaa Shop</h1>
  </div>
  <div style="padding:24px;">
    <p style="color:#374151;">Сайн байна уу, <strong>${r.name}</strong>!</p>
    <div style="color:#374151;line-height:1.6;">${message.replace(/\n/g, "<br>")}</div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
    <a href="https://shop.zarlaa.com"
       style="display:block;background:#f97316;color:#fff;text-align:center;padding:12px;border-radius:10px;text-decoration:none;font-weight:700;">
      Zarlaa Shop-руу зочлох →
    </a>
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px;">
      Та мэдэгдэл хүлээн авахгүй бол <a href="https://shop.zarlaa.com/unsubscribe" style="color:#f97316;">энд дарж</a> цуцлана уу.
    </p>
  </div>
</div>
</body></html>`,
            });
            sent++;
          } catch {
            failed++;
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: recipients.length,
    });
  } catch (error) {
    console.error("Bulk notify error:", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
