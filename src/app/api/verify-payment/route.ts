import { NextRequest, NextResponse } from "next/server";

function formatPrice(v: number) {
  return v.toLocaleString("mn-MN") + "₮";
}

async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

  if (!token || chatIds.length === 0) {
    console.warn("Telegram credentials not configured");
    return;
  }

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customer, total, payMethod, items } = body;

    const now = new Date().toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" });

    const PAY_LABELS: Record<string, string> = {
      qpay: "QPay",
      socialpay: "SocialPay",
      khanbank: "Хаан банк (5034538374)",
      golomt: "Голомт банк (1105196442)",
    };

    const itemLines = (items || [])
      .map((i: any) => `  • ${i.title} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`)
      .join("\n");

    const tgMsg = `✅ <b>ТӨЛБӨР ШАЛГАХ ХҮСЭЛТ!</b>

📦 <b>Захиалгын №:</b> <code>${orderId}</code>
🕐 <b>Огноо:</b> ${now}

👤 <b>Захиалагч:</b>
   Нэр: ${customer?.name || "-"}
   Утас: ${customer?.phone || "-"}
   Хаяг: ${customer?.address || "-"}

🧾 <b>Бараа:</b>
${itemLines || "  (мэдээлэл байхгүй)"}

💰 <b>Нийт дүн: ${formatPrice(total)}</b>
💳 <b>Төлбөрийн арга:</b> ${PAY_LABELS[payMethod] || payMethod}

⚠️ <b>Энэ захиалгын төлбөрийг шалгана уу!</b>`;

    await sendTelegram(tgMsg);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
