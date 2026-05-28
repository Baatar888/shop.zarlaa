"use client";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Дээш гарах"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-lg flex items-center justify-center transition-all duration-200"
    >
      <ChevronUp size={22} />
    </button>
  );
}
