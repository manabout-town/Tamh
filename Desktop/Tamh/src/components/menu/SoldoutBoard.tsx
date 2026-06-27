"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ArrowLeft, LayoutGrid, Search } from "lucide-react";
import { adminUpdateMenu } from "@/lib/admin-api";
import { cn, formatKRW } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";

interface Props {
  categories: Category[];
  menus: Menu[];
}

type Filter = "all" | "active" | "soldout";

export function SoldoutBoard({ categories, menus: initialMenus }: Props) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [filter, setFilter] = useState<Filter>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const soldoutCount = menus.filter((m) => !m.is_active).length;
  const activeCount = menus.filter((m) => m.is_active).length;

  const toggle = async (menu: Menu) => {
    setSaving((s) => new Set(s).add(menu.id));
    try {
      const updated = await adminUpdateMenu(menu.id, { is_active: !menu.is_active });
      setMenus((prev) => prev.map((m) => (m.id === menu.id ? updated : m)));
    } finally {
      setSaving((s) => {
        const next = new Set(s);
        next.delete(menu.id);
        return next;
      });
    }
  };

  const bulkSoldout = async (ids: string[]) => {
    setSaving(new Set([...saving, ...ids]));
    try {
      await Promise.all(ids.map((id) => adminUpdateMenu(id, { is_active: false })));
      setMenus((prev) =>
        prev.map((m) => (ids.includes(m.id) ? { ...m, is_active: false } : m))
      );
    } finally {
      setSaving((s) => {
        const next = new Set(s);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus.filter((m) => {
      if (filter === "active" && !m.is_active) return false;
      if (filter === "soldout" && m.is_active) return false;
      if (catFilter !== "all" && m.category_id !== catFilter) return false;
      if (q) {
        return (
          m.name.toLowerCase().includes(q) ||
          (m.name_ko ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [menus, filter, catFilter, query]);

  // 카테고리별 그룹핑
  const grouped = useMemo(() => {
    const map = new Map<string, Menu[]>();
    filtered.forEach((m) => {
      if (!map.has(m.category_id)) map.set(m.category_id, []);
      map.get(m.category_id)!.push(m);
    });
    const sorted = [...categories].sort((a, b) => a.priority - b.priority);
    return sorted
      .map((c) => ({ category: c, menus: map.get(c.id) ?? [] }))
      .filter((g) => g.menus.length > 0);
  }, [filtered, categories]);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { window.location.href = "/menu"; }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:text-black active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-black">품절 관리</h1>
              <p className="font-korean text-xs text-zinc-500">
                판매중 {activeCount} · 품절 {soldoutCount}
              </p>
            </div>
            {/* 현재 필터 내 판매중인 것들 일괄 품절 */}
            {filter !== "soldout" && filtered.filter((m) => m.is_active).length > 0 && (
              <button
                onClick={() =>
                  bulkSoldout(
                    filtered.filter((m) => m.is_active).map((m) => m.id)
                  )
                }
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-korean text-sm font-semibold text-red-700 transition-all active:scale-95"
              >
                일괄 품절
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-5 space-y-4">
        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="메뉴 검색"
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 font-korean text-sm text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
          />
        </div>

        {/* 상태 필터 */}
        <div className="flex gap-2">
          {([
            ["all", "전체", menus.length],
            ["active", "판매중", activeCount],
            ["soldout", "품절", soldoutCount],
          ] as [Filter, string, number][]).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 font-korean text-sm font-semibold transition-all active:scale-95",
                filter === key
                  ? key === "soldout"
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-black bg-black text-white"
                  : "border-zinc-200 bg-white text-zinc-600"
              )}
            >
              {label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-bold",
                  filter === key ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* 카테고리 필터 */}
        <div className="-mx-5 overflow-x-auto px-5 pb-1">
          <div className="flex w-max gap-2">
            <CategoryChip active={catFilter === "all"} onClick={() => setCatFilter("all")}>
              전체 카테고리
            </CategoryChip>
            {categories
              .sort((a, b) => a.priority - b.priority)
              .map((c) => (
                <CategoryChip
                  key={c.id}
                  active={catFilter === c.id}
                  onClick={() => setCatFilter(c.id)}
                >
                  {c.name}
                </CategoryChip>
              ))}
          </div>
        </div>

        {/* 메뉴 목록 */}
        <AnimatePresence mode="popLayout">
          {grouped.map(({ category, menus: items }) => (
            <motion.section
              key={category.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-display text-sm font-bold uppercase tracking-widest text-zinc-500">
                  {category.name}
                </h2>
                <span className="font-korean text-xs text-zinc-400">
                  {items.filter((m) => !m.is_active).length > 0 && (
                    <span className="mr-1 font-bold text-red-500">
                      품절 {items.filter((m) => !m.is_active).length}
                    </span>
                  )}
                  / {items.length}종
                </span>
              </div>
              <ul className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                {items.map((m) => (
                  <SoldoutRow
                    key={m.id}
                    menu={m}
                    isSaving={saving.has(m.id)}
                    onToggle={toggle}
                  />
                ))}
              </ul>
            </motion.section>
          ))}
        </AnimatePresence>

        {grouped.length === 0 && (
          <div className="py-20 text-center">
            <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-zinc-300" strokeWidth={1.2} />
            <p className="font-korean text-sm text-zinc-400">표시할 메뉴가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// SoldoutRow
// ──────────────────────────────────────────
function SoldoutRow({
  menu,
  isSaving,
  onToggle,
}: {
  menu: Menu;
  isSaving: boolean;
  onToggle: (m: Menu) => void;
}) {
  const soldOut = !menu.is_active;

  return (
    <li className={cn("px-4 py-3.5 transition-colors", soldOut ? "bg-red-50/40" : "")}>
      <div className="flex items-center gap-3">
        {/* 상태 아이콘 */}
        {soldOut ? (
          <XCircle className="h-5 w-5 shrink-0 text-red-500" strokeWidth={2} />
        ) : (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" strokeWidth={2} />
        )}

        {/* 이름 */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate font-display text-base font-semibold",
              soldOut ? "text-zinc-400 line-through" : "text-black"
            )}
          >
            {menu.name}
          </p>
          {menu.name_ko && (
            <p className="truncate font-korean text-xs text-zinc-400">{menu.name_ko}</p>
          )}
        </div>

        {/* 가격 */}
        <span className="shrink-0 font-korean text-sm font-bold tabular-nums text-zinc-500">
          ₩{formatKRW(menu.price)}
        </span>

        {/* 토글 버튼 — 큰 터치 타깃 */}
        <button
          onClick={() => onToggle(menu)}
          disabled={isSaving}
          className={cn(
            "shrink-0 rounded-xl px-4 py-2.5 font-korean text-sm font-bold transition-all active:scale-95 disabled:opacity-50",
            soldOut
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-red-500 text-white hover:bg-red-600"
          )}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : soldOut ? (
            "판매 재개"
          ) : (
            "품절 처리"
          )}
        </button>
      </div>
    </li>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full border px-4 font-korean text-xs font-semibold transition-all active:scale-95",
        active
          ? "border-black bg-black text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900"
      )}
    >
      {children}
    </button>
  );
}
