"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Wine, Sparkles, ShoppingBag, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/menu", label: "Menu", icon: Wine },
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { items, openCart } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-gold/10 backdrop-blur-luxe"
      style={{ background: "rgba(10,10,11,0.55)" }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="TÀMH home"
        >
          <span className="display-heading text-3xl lg:text-4xl text-gold-gradient">
            TÀMH
          </span>
          <span className="hidden h-6 w-px bg-gold/30 sm:block" />
          <span className="hidden font-serif text-xs uppercase tracking-widest2 text-ivory/60 sm:block">
            Single Malt · Cocktail
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest2 transition-colors",
                  active
                    ? "text-gold"
                    : "text-ivory/70 hover:text-gold",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-gold/30 bg-gold/5"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cart */}
        <button
          onClick={openCart}
          className="group relative inline-flex items-center gap-2 rounded-full border border-gold/30 bg-charcoal-100/40 px-4 py-2.5 text-sm uppercase tracking-widest2 text-ivory transition-all hover:border-gold/60 hover:text-gold"
          aria-label={`장바구니 (${cartCount}개)`}
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold text-charcoal-900"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
      </div>
    </motion.header>
  );
}
