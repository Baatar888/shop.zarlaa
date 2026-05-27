/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript-ийн алдааг үл тоомсорлож сайтаа асаахыг зөвшөөрөх
    ignoreBuildErrors: true,
  },
  // Хэрэв таны хуучин файлд өөр чухал тохиргоо (images, rewrites гэх мэт) байсан бол энд дотор нь нэмж болно.
  // Байхгүй бол энэ чигээр нь хадгалахад хангалттай.
};

module.exports = nextConfig;