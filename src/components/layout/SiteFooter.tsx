"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const isMenu = pathname === "/menu" || pathname.startsWith("/menu/");
  if (isMenu) return null;

  return (
    <footer className="mt-20 border-t border-gold/10 bg-charcoal-400/40 backdrop-blur-luxe">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs uppercase tracking-widest2 text-ivory/40 lg:px-10">
        <span className="display-heading text-base text-gold-gradient">TÀMH</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
