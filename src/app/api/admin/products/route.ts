import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MOCK_PRODUCTS } from "@/lib/mockData";

function isAdmin(session: any) {
  return session?.user?.role === "ADMIN";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const q = searchParams.get("q") ?? "";

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: q ? { title: { contains: q, mode: "insensitive" } } : {},
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
          vendor: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: q ? { title: { contains: q, mode: "insensitive" } } : {} }),
    ]);
    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    // Fallback to mock data
    let filtered = MOCK_PRODUCTS;
    if (q) filtered = filtered.filter(p => p.title.toLowerCase().includes(q.toLowerCase()));
    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);
    return NextResponse.json({
      products: paginated.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        originalPrice: p.originalPrice,
        salePrice: p.salePrice,
        stock: p.stock,
        isActive: true,
        isFeatured: p.isFeatured,
        images: p.images,
        category: p.category,
        vendor: p.vendor,
        createdAt: p.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, originalPrice, salePrice, stock, categoryId, vendorId, images, isFeatured, notifyUsers } = body;

    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") + "-" + Date.now();

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        originalPrice,
        salePrice,
        stock: stock || 0,
        categoryId,
        vendorId,
        isFeatured: isFeatured || false,
        images: {
          create: (images || []).map((url: string, i: number) => ({
            url,
            isPrimary: i === 0,
          })),
        },
      },
    });

    // Bulk notify if requested
    if (notifyUsers) {
      const users = await prisma.user.findMany({ select: { email: true, name: true } });
      // Queue notifications (simplified - in production use a queue like BullMQ)
      scheduleNotifications(users, title, product.id);
    }

    return NextResponse.json({ product, success: true });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...data } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.originalPrice && { originalPrice: data.originalPrice }),
        ...(data.salePrice && { salePrice: data.salePrice }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      },
    });

    return NextResponse.json({ product, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Simple rate-limited notification scheduler
async function scheduleNotifications(
  users: { email: string; name: string }[],
  productTitle: string,
  productId: string
) {
  const BATCH_SIZE = 5;
  const DELAY_MS = 1000;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    await new Promise((r) => setTimeout(r, i === 0 ? 0 : DELAY_MS));

    for (const user of batch) {
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
          to: user.email,
          subject: `✨ Шинэ бараа нэмэгдлээ: ${productTitle}`,
          html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#f9fafb;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <div style="background:#f97316;padding:24px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:22px;">✨ Шинэ бараа!</h1>
  </div>
  <div style="padding:24px;">
    <p style="color:#374151;">Сайн байна уу, <strong>${user.name}</strong>!</p>
    <p style="color:#374151;">Zarlaa.com-д шинэ бараа нэмэгдлээ:</p>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;text-align:center;margin:16px 0;">
      <p style="color:#ea580c;font-size:18px;font-weight:900;margin:0;">${productTitle}</p>
    </div>
    <a href="https://shop.zarlaa.com/products/${productId}"
       style="display:block;background:#f97316;color:#fff;text-align:center;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;margin-top:16px;">
      Барааг харах →
    </a>
  </div>
</div>
</body></html>`,
        });
      } catch (err) {
        console.warn(`Email to ${user.email} failed:`, err);
      }
    }
  }
}
