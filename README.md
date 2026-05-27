# MMART — Монгол Marketplace

gompiers.com шиг онлайн худалдааны платформ. Next.js 14, PostgreSQL, Prisma ашигласан.

## Технологийн стек

| Давхарга | Технологи |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, shadcn/ui |
| State | Zustand (cart), React Server Components |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Credentials + Google) |
| Зураг | Cloudinary (next/image + automatic WebP) |
| Байршуулалт | DigitalOcean VPS + Cloudflare CDN |

## Эхлүүлэх

```bash
# 1. Суулгах
npm install

# 2. Environment хувьсагчид
cp .env.local.example .env.local
# .env.local файлыг засч DATABASE_URL болон бусад утгуудыг оруулна

# 3. Database migration
npm run db:migrate

# 4. Dev server
npm run dev
```

## Хавтасны бүтэц

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Нүүр хуудас
│   ├── (auth)/                 # Login, Register
│   ├── (shop)/                 # Нийтийн хуудсууд
│   │   ├── products/           # Бүх бараа + filter
│   │   ├── products/[slug]/    # Барааны дэлгэрэнгүй
│   │   ├── cart/               # Сагс
│   │   └── checkout/           # Захиалга
│   ├── (dashboard)/            # Нэвтэрсэн хэрэглэгч
│   │   ├── dashboard/          # Захиалгууд
│   │   └── vendor/             # Vendor dashboard
│   └── api/                    # Route Handlers
├── components/
│   ├── layout/                 # Navbar, Footer, Hero, Banners
│   ├── product/                # ProductCard, ProductGrid, Filter
│   └── vendor/                 # ProductForm, OrderTable
├── hooks/
│   └── useCart.ts              # Zustand cart store
└── lib/
    ├── prisma.ts               # Prisma singleton
    ├── utils.ts                # calcDiscount, formatPrice
    ├── auth.ts                 # NextAuth config
    └── types.ts                # TypeScript types
```

## Гол функцууд

### calcDiscount(originalPrice, salePrice)
```ts
calcDiscount(150_000, 82_500) // => 45  (хямдралын %)
```

### ProductCard — автомат хямдрал
```tsx
<ProductCard product={product} />
// salePrice < originalPrice бол "-45%" badge автоматаар харагдана
```

### API Filter params
```
GET /api/products?q=nike&category=clothing&sort=discount&minPrice=10000&maxPrice=200000&page=1
```

## Дараагийн алхамууд

- [ ] `/products/[slug]` — барааны дэлгэрэнгүй хуудас
- [ ] `/cart` — сагсны хуудас
- [ ] `/checkout` — захиалгын хуудас
- [ ] `/vendor/products/new` — бараа нэмэх форм
- [ ] NextAuth нэвтрэх систем
- [ ] Cloudinary зураг upload
- [ ] Admin panel
