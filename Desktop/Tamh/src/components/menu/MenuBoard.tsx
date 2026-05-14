"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";
import { MenuRow } from "./MenuRow";
import { MenuCreateModal } from "./MenuCreateModal";

interface Props {
  categories: Category[];
  menus: Menu[];
}

// 항상 맨 우측에 위치해야 하는 카테고리 이름 (영문)
const TRAILING_CATEGORIES = new Set(["Cocktail", "Food"]);

export function MenuBoard({ categories, menus: initialMenus }: Props) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  // 메뉴 수정 후 상태에 반영
  const handleUpdated = (m: Menu) => {
    setMenus((prev) => prev.map((p) => (p.id === m.id ? m : p)));
  };

  // 메뉴 삭제 후 상태 반영
  const handleDeleted = (id: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  // 메뉴 생성 후 상태 반영
  const handleCreated = (m: Menu) => {
    setMenus((prev) => [m, ...prev]);
  };

  // 카테고리 정렬: 일반 카테고리 (priority 순) + 트레일 (Cocktail, Food) 맨 끝
  const sortedCategories = useMemo(() => {
    const main = categories
      .filter((c) => !TRAILING_CATEGORIES.has(c.name))
      .sort((a, b) => a.priority - b.priority);
    const trailing = categories
      .filter((c) => TRAILING_CATEGORIES.has(c.name))
      .sort((a, b) => {
        // Cocktail 먼저, Food 마지막
        if (a.name === "Cocktail" && b.name === "Food") return -1;
        if (a.name === "Food" && b.name === "Cocktail") return 1;
        return a.priority - b.priority;
      });
    return [...main, ...trailing];
  }, [categories]);

  // 카테고리 + 검색 필터
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus.filter((m) => {
      if (active !== "all" && m.category_id !== active) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        (m.name_ko ?? "").toLowerCase().includes(q)
      );
    });
  }, [menus, active, query]);

  // 카테고리별 그룹핑 (섹션 순서는 sortedCategories 따라감)
  const grouped = useMemo(() => {
    const map = new Map<string, Menu[]>();
    filtered.forEach((m) => {
      if (!map.has(m.category_id)) map.set(m.category_id, []);
      map.get(m.category_id)!.push(m);
    });
    return sortedCategories
      .map((c) => ({ category: c, menus: map.get(c.id) ?? [] }))
      .filter((g) => g.menus.length > 0);
  }, [filtered, sortedCategories]);

  return (
    <div>
      {/* 검색 + 메뉴 추가 */}
      <div className="sticky top-20 z-20 -mx-2 mb-8 space-y-3 backdrop-blur-luxe">
        <div className="flex items-center gap-3 px-2 pt-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60"
              strokeWidth={1.5}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="메뉴 이름 검색 (영문 / 한글)"
              className="w-full rounded-full border border-gold/20 bg-charcoal-100/60 py-3 pl-11 pr-10 font-korean text-base text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ivory/50 hover:text-gold"
                aria-label="검색어 지우기"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            )}
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-3 font-korean text-sm font-semibold text-charcoal-900 shadow-gold-glow transition-all hover:shadow-gold-glow-lg active:scale-95"
          >
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            메뉴 추가
          </button>
        </div>

        {/* 필터 칩 — Cocktail/Food는 항상 맨 우측 */}
        <div className="flex items-center gap-2 overflow-x-auto px-2 pb-3 luxe-scroll">
          <Filter className="h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
          <Chip active={active === "all"} onClick={() => setActive("all")} korean>
            전체
          </Chip>
          {sortedCategories.map((c) => (
            <Chip
              key={c.id}
              active={active === c.id}
              onClick={() => setActive(c.id)}
              tone={
                c.name === "Cocktail"
                  ? "cocktail"
                  : c.name === "Food"
                    ? "food"
                    : "default"
              }
            >
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      {/* 빈 상태 */}
      {grouped.length === 0 && (
        <div className="py-20 text-center font-korean italic text-ivory/50">
          {menus.length === 0
            ? "메뉴 데이터가 없습니다. supabase/seed.sql 을 실행해주세요."
            : "검색 결과가 없습니다."}
        </div>
      )}

      {/* 섹션 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active + query}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="space-y-14"
        >
          {grouped.map(({ category, menus }) => (
            <section key={category.id}>
              <header className="mb-4 flex items-end justify-between border-b border-gold/15 pb-3">
                <div>
                  <h2 className="display-heading text-3xl">{category.name}</h2>
                  {category.subtitle && (
                    <p className="mt-1 font-serif text-sm italic text-ivory/45">
                      {category.subtitle}
                    </p>
                  )}
                </div>
                <span className="font-korean text-xs text-ivory/40">
                  {menus.length} items
                </span>
              </header>

              <ul className="divide-y divide-gold/5 rounded-2xl border border-gold/10 bg-charcoal-100/35 backdrop-blur-luxe">
                {menus.map((m) => (
                  <MenuRow
                    key={m.id}
                    menu={m}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                  />
                ))}
              </ul>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 메뉴 생성 모달 */}
      <AnimatePresence>
        {creating && (
          <MenuCreateModal
            categories={sortedCategories}
            onClose={() => setCreating(false)}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// Filter Chip
// =========================================================
function Chip({
  active,
  onClick,
  children,
  korean,
  tone = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  korean?: boolean;
  tone?: "default" | "cocktail" | "food";
}) {
  const accent =
    tone === "cocktail"
      ? "border-cognac/40 text-cognac/90 hover:border-cognac hover:text-cognac"
      : tone === "food"
        ? "border-emerald-400/30 text-emerald-300/90 hover:border-emerald-400 hover:text-emerald-300"
        : "border-gold/20 text-ivory/65 hover:border-gold/50 hover:text-gold";

  const activeBg =
    tone === "cocktail"
      ? "border-cognac bg-cognac text-charcoal-900"
      : tone === "food"
        ? "border-emerald-400 bg-emerald-400 text-charcoal-900"
        : "border-gold bg-gold text-charcoal-900 shadow-gold-glow";

  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border bg-charcoal-100/30 px-4 py-1.5 transition-all",
        korean
          ? "font-korean text-sm font-medium"
          : "font-display text-sm font-semibold",
        active ? activeBg : accent,
      )}
    >
      {children}
    </button>
  );
}
