"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Wine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";
import { MenuCard } from "./MenuCard";
import { FALLBACK_CATEGORIES, FALLBACK_MENUS } from "./fallback-data";

interface Props {
  categories: Category[];
  menus: Menu[];
}

export function MenuMagazineLayout({ categories, menus }: Props) {
  // 비어있으면 fallback (디자인 시연용)
  const cats = categories.length ? categories : FALLBACK_CATEGORIES;
  const items = menus.length ? menus : FALLBACK_MENUS;

  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return items;
    if (active === "recommended") return items.filter((m) => m.is_recommended);
    return items.filter((m) => m.category_id === active);
  }, [items, active]);

  // 카테고리별로 그룹핑 (잡지 레이아웃)
  const grouped = useMemo(() => {
    const map = new Map<string, Menu[]>();
    filtered.forEach((m) => {
      if (!map.has(m.category_id)) map.set(m.category_id, []);
      map.get(m.category_id)!.push(m);
    });
    return Array.from(map.entries())
      .map(([cid, list]) => ({
        category: cats.find((c) => c.id === cid),
        menus: list,
      }))
      .filter((g) => g.category)
      .sort(
        (a, b) =>
          (a.category?.priority ?? 999) - (b.category?.priority ?? 999),
      );
  }, [filtered, cats]);

  return (
    <div>
      {/* Filter bar — Sticky */}
      <div className="sticky top-20 z-20 -mx-2 mb-12 backdrop-blur-luxe">
        <div className="flex items-center gap-3 overflow-x-auto px-2 py-4 luxe-scroll">
          <Filter
            className="h-4 w-4 shrink-0 text-gold/70"
            strokeWidth={1.5}
          />
          <FilterChip
            label="All"
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          <FilterChip
            label="Signature"
            icon={<Sparkles className="h-3 w-3" strokeWidth={1.8} />}
            active={active === "recommended"}
            onClick={() => setActive("recommended")}
          />
          {cats.map((c) => (
            <FilterChip
              key={c.id}
              label={c.name}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Magazine sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-24"
        >
          {grouped.map(({ category, menus: catMenus }) => (
            <section key={category!.id} id={category!.id}>
              {/* Section header — Magazine style */}
              <div className="mb-10 grid items-end gap-6 border-b border-gold/15 pb-8 md:grid-cols-12">
                <div className="md:col-span-8">
                  <p className="font-serif text-xs uppercase tracking-widest2 text-gold">
                    <Wine className="mr-2 inline h-3.5 w-3.5" strokeWidth={1.5} />
                    Section · {String(category!.priority).padStart(2, "0")}
                  </p>
                  <h2 className="display-heading mt-3 text-[clamp(2rem,5vw,3.5rem)] leading-none">
                    {category!.name}
                  </h2>
                  {category!.subtitle && (
                    <p className="mt-3 font-serif text-base italic text-ivory/65">
                      {category!.subtitle}
                    </p>
                  )}
                </div>
                <p className="font-serif text-sm text-ivory/40 md:col-span-4 md:text-right">
                  {catMenus.length} selections
                </p>
              </div>

              {/* Layout: 첫 카드는 크게(에디토리얼), 나머지는 그리드 */}
              {catMenus.length > 0 && (
                <>
                  {/* Feature card */}
                  <MenuCard menu={catMenus[0]} variant="feature" />

                  {/* Grid for the rest */}
                  {catMenus.length > 1 && (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {catMenus.slice(1).map((m, idx) => (
                        <MenuCard
                          key={m.id}
                          menu={m}
                          variant="grid"
                          index={idx}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          ))}

          {grouped.length === 0 && (
            <div className="py-24 text-center font-serif text-lg text-ivory/50">
              표시할 메뉴가 없습니다.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs uppercase tracking-widest2 transition-all",
        active
          ? "border-gold bg-gold text-charcoal-900 shadow-gold-glow"
          : "border-gold/20 bg-charcoal-100/30 text-ivory/70 hover:border-gold/50 hover:text-gold",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
