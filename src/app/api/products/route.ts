import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const featured = searchParams.get("featured") === "true";

  try {
    const where: any = { isActive: true };
    if (q) where.title = { contains: q, mode: "insensitive" };
    if (featured) where.isFeatured = true;
    if (minPrice || maxPrice) {
      where.salePrice = {};
      if (minPrice) where.salePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.salePrice.lte = parseFloat(maxPrice);
    }
    if (category) {
      where.category = { slug: category };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { salePrice: "asc" };
    else if (sort === "price_desc") orderBy = { salePrice: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
          vendor: { select: { shopName: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    let result = [...products];

    if (sort === "discount") {
      result.sort((a, b) => {
        const da = ((a.originalPrice - a.salePrice) / a.originalPrice) * 100;
        const db = ((b.originalPrice - b.salePrice) / b.originalPrice) * 100;
        return db - da;
      });
    }

    return NextResponse.json({
      products: result,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Products DB error, falling back to mock:", err);

    let products = [...MOCK_PRODUCTS];
    if (q) {
      const lower = q.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          (p.brand?.toLowerCase().includes(lower) ?? false)
      );
    }
    if (category) products = products.filter((p) => p.category.slug === category);
    if (featured) products = products.filter((p) => p.isFeatured);
    if (minPrice) products = products.filter((p) => p.salePrice >= parseFloat(minPrice));
    if (maxPrice) products = products.filter((p) => p.salePrice <= parseFloat(maxPrice));

    if (sort === "price_asc") products.sort((a, b) => a.salePrice - b.salePrice);
    else if (sort === "price_desc") products.sort((a, b) => b.salePrice - a.salePrice);
    else if (sort === "discount") {
      products.sort((a, b) => {
        const da = ((a.originalPrice - a.salePrice) / a.originalPrice) * 100;
        const db = ((b.originalPrice - b.salePrice) / b.originalPrice) * 100;
        return db - da;
      });
    } else products.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

    const total = products.length;
    const paginated = products.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      products: paginated,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  }
}
