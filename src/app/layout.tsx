import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import NewProductNotification from "@/components/layout/NewProductNotification";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "Shop Zarlaa — Монголын онлайн зах",
    template: "%s | Shop Zarlaa",
  },
  description: "Монголын хамгийн том онлайн худалдааны платформ.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className="antialiased bg-gray-50 font-sans">
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
          <NewProductNotification />
        </SessionProvider>
      </body>
    </html>
  );
}
