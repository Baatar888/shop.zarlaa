import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || (!email && !phone) || !password) {
      return NextResponse.json(
        { error: "Нэр, и-мэйл эсвэл утас, нууц үг шаардлагатай" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" },
        { status: 400 }
      );
    }

    const lookupEmail = email || `phone_${phone}@zarlaa.local`;

    // Check duplicate
    const existing = await prisma.user.findUnique({ where: { email: lookupEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "Энэ и-мэйл эсвэл утасны дугаар бүртгэлтэй байна" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: lookupEmail,
        phone: phone || null,
        passwordHash,
        role: "BUYER",
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user, success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Бүртгэл үүсгэхэд алдаа гарлаа" }, { status: 500 });
  }
}
