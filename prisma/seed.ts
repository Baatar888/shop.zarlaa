import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Тохиргоо: ADMIN_EMAIL болон ADMIN_PASSWORD-г .env файлаас уншина
  const adminEmail = process.env.ADMIN_EMAIL || "hero@zarlaa.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is required!");
    process.exit(1);
  }

  const hash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash, role: "ADMIN" },
    create: {
      name: "Hero",
      email: adminEmail,
      passwordHash: hash,
      role: "ADMIN",
    },
  });

  console.log("Admin user created/updated:", admin.email);
  console.log("Login at: https://shop.zarlaa.com/udird");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
