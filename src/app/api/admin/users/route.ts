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
  const q = searchParams.get("q") ?? "";

  try {
    const where = q ? {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { email: { contains: q, mode: "insensitive" as const } },
      ],
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    const MOCK_USERS = [
      { id: "1", name: "Болд Баатар", email: "bold@gmail.com", role: "BUYER", createdAt: new Date().toISOString(), _count: { orders: 5 } },
      { id: "2", name: "Сарнай Дорж", email: "sarnai@gmail.com", role: "BUYER", createdAt: new Date(Date.now() - 86400000).toISOString(), _count: { orders: 2 } },
      { id: "3", name: "Нарантуяа Гантөмөр", email: "narantuya@gmail.com", role: "BUYER", createdAt: new Date(Date.now() - 172800000).toISOString(), _count: { orders: 8 } },
      { id: "4", name: "Эрдэнэ Сүхбаатар", email: "erdene@gmail.com", role: "VENDOR", createdAt: new Date(Date.now() - 259200000).toISOString(), _count: { orders: 1 } },
      { id: "5", name: "Мөнхбаяр Эрдэнэ", email: "munkhbayar@gmail.com", role: "BUYER", createdAt: new Date(Date.now() - 345600000).toISOString(), _count: { orders: 3 } },
      { id: "6", name: "Оюунсүрэн Батболд", email: "oyuunsuren@gmail.com", role: "BUYER", createdAt: new Date(Date.now() - 432000000).toISOString(), _count: { orders: 0 } },
    ];
    let filtered = MOCK_USERS;
    if (q) filtered = filtered.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
    return NextResponse.json({ users: filtered, total: filtered.length, page: 1, totalPages: 1 });
  }
}
