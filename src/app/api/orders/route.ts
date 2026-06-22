import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

/* ── Helpers ── */
function genOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `GP${yy}${mm}${dd}-${rand}`;
}

function formatPrice(v: number) {
  return v.toLocaleString("mn-MN") + "₮";
}

const PAY_LABELS: Record<string, string> = {
  qpay: "QPay",
  socialpay: "SocialPay",
  khanbank: "Хаан банк (5034538374)",
  golomt: "Голомт банк (1105196442)",
};

/* ── Telegram ── */
async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) return;

  await Promise.all(
    chatIds.map((chatId) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      })
    )
  );
}

/* ── Email ── */
async function sendEmail(to: string, subject: string, html: string) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn("SMTP credentials not configured, skipping email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"Zarlaa Shop" <${smtpUser}>`,
    to,
    subject,
    html,
  });
}

/* ── POST handler ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, payMethod, total, subtotal, deliveryFee } = body;

    const orderId = genOrderId();
    const now = new Date().toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" });
    const payLabel = PAY_LABELS[payMethod] || payMethod;

    /* ─ Save order to MongoDB ─ */
    try {
      await prisma.order.create({
        data: {
          orderId,
          totalAmount: total,
          deliveryFee: deliveryFee || 0,
          status: "PENDING",
          address: customer.address,
          phone: customer.phone,
          customerName: customer.name,
          district: customer.district,
          khoroo: customer.khoroo,
          note: customer.note,
          payMethod,
          items: {
            create: items.map((i: any) => ({
              title: i.title,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        },
      });
    } catch (dbErr) {
      console.error("Order DB save failed:", dbErr);
      // Continue anyway — still send notifications
    }

    /* ─ Build item list text ─ */
    const itemLines = items
      .map((i: any) => `  • ${i.title} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`)
      .join("\n");

    /* ─ Telegram message ─ */
    const tgMsg = `🛒 <b>ШИНЭ ЗАХИАЛГА!</b>

📦 <b>Захиалгын №:</b> <code>${orderId}</code>
🕐 <b>Огноо:</b> ${now}

👤 <b>Захиалагч:</b>
   Нэр: ${customer.name}
   Утас: ${customer.phone}
   Хот: ${customer.district}
   Хороо: ${customer.khoroo || "-"}
   Хаяг: ${customer.address}
${customer.note ? `   Тэмдэглэл: ${customer.note}` : ""}

🧾 <b>Бараа:</b>
${itemLines}

💰 <b>Тооцоо:</b>
   Бараа: ${formatPrice(subtotal)}
   Хүргэлт: ${formatPrice(deliveryFee)}
   <b>Нийт: ${formatPrice(total)}</b>

💳 <b>Төлбөр:</b> ${payLabel}`;

    /* ─ Email HTML ─ */
    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Шинэ захиалга</title></head>
<body style="font-family:sans-serif;background:#f9fafb;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#f97316;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">🛒 Шинэ захиалга!</h1>
      <p style="color:#fff;opacity:.9;margin:6px 0 0;font-size:14px;">${now}</p>
    </div>
    <div style="padding:24px;">
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;">
        <p style="color:#92400e;margin:0 0 4px;font-size:12px;">Захиалгын дугаар</p>
        <p style="color:#ea580c;font-size:24px;font-weight:900;margin:0;letter-spacing:2px;">${orderId}</p>
      </div>
      <h3 style="color:#374151;font-size:14px;margin:0 0 8px;">👤 Захиалагч</h3>
      <table style="width:100%;font-size:13px;color:#4b5563;margin-bottom:20px;">
        <tr><td style="padding:4px 0;color:#9ca3af;">Нэр</td><td>${customer.name}</td></tr>
        <tr><td style="padding:4px 0;color:#9ca3af;">Утас</td><td>${customer.phone}</td></tr>
        <tr><td style="padding:4px 0;color:#9ca3af;">Хот</td><td>${customer.district}</td></tr>
        <tr><td style="padding:4px 0;color:#9ca3af;">Хороо</td><td>${customer.khoroo || "-"}</td></tr>
        <tr><td style="padding:4px 0;color:#9ca3af;">Хаяг</td><td>${customer.address}</td></tr>
        ${customer.note ? `<tr><td style="padding:4px 0;color:#9ca3af;">Тэмдэглэл</td><td>${customer.note}</td></tr>` : ""}
      </table>
      <h3 style="color:#374151;font-size:14px;margin:0 0 8px;">🧾 Бараа</h3>
      <div style="background:#f9fafb;border-radius:10px;padding:12px;margin-bottom:20px;">
        ${items
          .map(
            (i: any) => `
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb;font-size:13px;">
            <span style="color:#374151;">${i.title} <span style="color:#9ca3af;">×${i.quantity}</span></span>
            <span style="font-weight:700;color:#1f2937;">${formatPrice(i.price * i.quantity)}</span>
          </div>`
          )
          .join("")}
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#6b7280;">
          <span>Хүргэлт</span><span>${formatPrice(deliveryFee)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0 0;font-size:16px;font-weight:900;color:#f97316;">
          <span>Нийт</span><span>${formatPrice(total)}</span>
        </div>
      </div>
      <div style="background:#eff6ff;border-radius:10px;padding:12px;font-size:13px;color:#1e40af;">
        💳 <strong>Төлбөрийн арга:</strong> ${payLabel}
      </div>
    </div>
  </div>
</body>
</html>`;

    const notifEmail = process.env.NOTIFY_EMAIL || "info@zarlaa.com";

    const results = await Promise.allSettled([
      sendTelegram(tgMsg),
      sendEmail(notifEmail, `🛒 Шинэ захиалга [${orderId}] — ${customer.name}`, emailHtml),
    ]);

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.warn(`Notification ${i === 0 ? "Telegram" : "Email"} failed:`, r.reason);
      }
    });

    return NextResponse.json({ orderId, success: true });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
