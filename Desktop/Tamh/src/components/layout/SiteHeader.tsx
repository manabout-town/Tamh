"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * SiteHeader — 메뉴판이 유일한 페이지가 되어
 * /menu 에서는 자체 로고/네비를 사용하므로 헤더는 숨깁니다.
 * /menu 외의 페이지에서만 작은 헤더가 표시됩니다.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isMenu = pathname === "/menu" || pathname.startsWith("/menu/");
  if (isMenu) return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-gold/15 backdrop-blur-luxe"
      style={{ background: "rgba(10,10,11,0.65)" }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/menu" className="flex items-center gap-3" aria-label="TÀMH home">
          <span className="display-heading text-3xl text-gold-gradient">TÀMH</span>
        </Link>
      </div>
    </motion.header>
  );
}
