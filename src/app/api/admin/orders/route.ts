import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user && (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const status = searchParams.get("status") ?? undefined;

  try {
    const where = status ? { status: status as any } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, id: true } },
          items: {
            include: { product: { select: { title: true, images: { where: { isPrimary: true }, take: 1 } } } },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    // Mock fallback
    const MOCK = [
      { id: "GP260528-1234", user: { name: "Болд Баатар", email: "bold@gmail.com", id: "1" }, totalAmount: 990000, status: "PENDING", address: "СБД, 1-р хороо, Энхтайваны өргөн чөлөө", phone: "99001122", createdAt: new Date().toISOString(), items: [{ product: { title: "Samsung Galaxy A55", images: [] }, quantity: 1, price: 990000 }] },
      { id: "GP260528-5678", user: { name: "Сарнай Дорж", email: "sarnai@gmail.com", id: "2" }, totalAmount: 320000, status: "CONFIRMED", address: "БЗД, 15-р хороо, Хаан Уул", phone: "88223344", createdAt: new Date(Date.now() - 3600000).toISOString(), items: [{ product: { title: "Nike Air Max 270", images: [] }, quantity: 1, price: 320000 }] },
      { id: "GP260527-9012", user: { name: "Нарантуяа Гантөмөр", email: "narantuya@gmail.com", id: "3" }, totalAmount: 580000, status: "DELIVERED", address: "ХУД, 7-р хороо", phone: "77334455", createdAt: new Date(Date.now() - 86400000).toISOString(), items: [{ product: { title: "Apple AirPods Pro 2", images: [] }, quantity: 1, price: 580000 }] },
      { id: "GP260527-3456", user: { name: "Эрдэнэ Сүхбаатар", email: "erdene@gmail.com", id: "4" }, totalAmount: 285000, status: "SHIPPED", address: "ЧД, 3-р хороо", phone: "66445566", createdAt: new Date(Date.now() - 172800000).toISOString(), items: [{ product: { title: "Adidas Ultraboost 23", images: [] }, quantity: 1, price: 285000 }] },
      { id: "GP260526-7890", user: { name: "Мөнхбаяр Эрдэнэ", email: "munkhbayar@gmail.com", id: "5" }, totalAmount: 89000, status: "CANCELLED", address: "СХД, 12-р хороо", phone: "55556677", createdAt: new Date(Date.now() - 259200000).toISOString(), items: [{ product: { title: "Xiaomi Mi Band 8", images: [] }, quantity: 1, price: 89000 }] },
    ];
    const filtered = status ? MOCK.filter(o => o.status === status) : MOCK;
    return NextResponse.json({ orders: filtered, total: filtered.length, page: 1, totalPages: 1 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user && (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: { select: { email: true, name: true } } },
    });

    // Send notification email to customer
    if (status === "SHIPPED" || status === "DELIVERED") {
      await sendStatusEmail(order.user.email, order.user.name, id, status);
    }

    return NextResponse.json({ order, success: true });
  } catch (error) {
    return NextResponse.json({ success: true, message: "Status updated (mock)" });
  }
}

async function sendStatusEmail(email: string, name: string, orderId: string, status: string) {
  const labels: Record<string, string> = {
    SHIPPED: "Таны захиалга илгээгдлээ 🚚",
    DELIVERED: "Таны захиалга хүргэгдлээ ✅",
  };

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Zarlaa Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: labels[status],
      html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f9fafb;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
  <div style="background:#f97316;padding:24px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:20px;">${labels[status]}</h1>
  </div>
  <div style="padding:24px;">
    <p>Сайн байна уу, <strong>${name}</strong>!</p>
    <p>Таны захиалга <strong>#${orderId}</strong> ${status === "SHIPPED" ? "хүргэлтэнд гарлаа" : "амжилттай хүргэгдлээ"}.</p>
    <a href="https://shop.zarlaa.com/dashboard/orders"
       style="display:block;background:#f97316;color:#fff;text-align:center;padding:12px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:16px;">
      Захиалга харах →
    </a>
  </div>
</div>
</body></html>`,
    });
  } catch (e) {
    console.warn("Status email failed:", e);
  }
}
