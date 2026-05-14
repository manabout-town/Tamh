"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Wine, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/menu",  label: "메뉴", sub: "Menu",  icon: Wine },
  { href: "/store", label: "매장", sub: "Store", icon: LayoutGrid },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-gold/15 backdrop-blur-luxe"
      style={{ background: "rgba(10,10,11,0.65)" }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/menu" className="flex items-center gap-3" aria-label="TÀMH home">
          <span className="display-heading text-3xl text-gold-gradient">TÀMH</span>
          <span className="hidden h-6 w-px bg-gold/30 sm:block" />
          <span className="hidden font-serif text-xs uppercase tracking-widest2 text-ivory/60 sm:block">
            Single Malt · Cocktail Bar
          </span>
        </Link>

        {/* Tabs — 메뉴 / 매장 */}
        <nav className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm tracking-widest2 transition-colors",
                  active ? "text-gold" : "text-ivory/65 hover:text-gold",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="font-korean text-base font-medium">{item.label}</span>
                <span className="hidden text-[10px] uppercase opacity-60 md:inline">
                  {item.sub}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-gold/35 bg-gold/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
