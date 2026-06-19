"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import type { Category, Menu } from "@/types/database";
import { PRIMARY_GROUPS, groupOf, type GroupKey } from "@/lib/category-groups";
import { CleanMenuRow } from "./CleanMenuRow";
import { MenuFormModal } from "./MenuFormModal";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  menus: Menu[];
}

const TAB_KEY = "tamh-menu-tab";
const SUB_KEY = "tamh-menu-sub";

export function CleanMenuBoard({ categories, menus: initialMenus }: Props) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [tab, setTab] = useState<GroupKey>("whisky");
  const [sub, setSub] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // 첫 진입 시 localStorage 복원
  useEffect(() => {
    const savedTab = localStorage.getItem(TAB_KEY) as GroupKey | null;
    const savedSub = localStorage.getItem(SUB_KEY);
    if (savedTab && PRIMARY_GROUPS.some((g) => g.key === savedTab)) {
      setTab(savedTab);
    }
    if (savedSub) setSub(savedSub);
    setHydrated(true);
  }, []);

  const switchTab = (next: GroupKey) => {
    setTab(next);
    setSub("all");
    localStorage.setItem(TAB_KEY, next);
    localStorage.setItem(SUB_KEY, "all");
  };
  const switchSub = (id: string) => {
    setSub(id);
    localStorage.setItem(SUB_KEY, id);
  };

  // 현재 탭에 속하는 카테고리
  const groupDef = PRIMARY_GROUPS.find((g) => g.key === tab)!;
  const categoriesInTab = useMemo(() => {
    const byName = new Map(categories.map((c) => [c.name, c]));
    return groupDef.categoryNames
      .map((n) => byName.get(n))
      .filter((c): c is Category => !!c);
  }, [categories, groupDef]);

  // 검색이 활성화되면 탭/서브 무시하고 전체 메뉴에서 검색
  const isSearching = query.trim().length > 0;

  // 필터링 + 그룹핑
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, Menu[]>();

    menus
      .filter((m) => {
        // 검색 중이면 전체에서 매칭
        if (isSearching) {
          return (
            m.name.toLowerCase().includes(q) ||
            (m.name_ko ?? "").toLowerCase().includes(q)
          );
        }
        // 일반 모드: 탭 → 서브 카테고리 필터
        const catName = categories.find((c) => c.id === m.category_id)?.name ?? "";
        if (groupOf(catName) !== tab) return false;
        if (sub !== "all" && m.category_id !== sub) return false;
        return true;
      })
      .forEach((m) => {
        if (!map.has(m.category_id)) map.set(m.category_id, []);
        map.get(m.category_id)!.push(m);
      });

    // 정렬: 검색 중이면 전체 카테고리(priority 순) 기준, 아니면 탭 안의 카테고리만
    const sourceCategories = isSearching
      ? [...categories].sort((a, b) => a.priority - b.priority)
      : categoriesInTab;

    return sourceCategories
      .map((c) => ({ category: c, menus: map.get(c.id) ?? [] }))
      .filter((g) => g.menus.length > 0);
  }, [menus, categories, tab, sub, query, isSearching, categoriesInTab]);

  const handleUpdated = (m: Menu) =>
    setMenus((prev) => prev.map((p) => (p.id === m.id ? m : p)));
  const handleDeleted = (id: string) =>
    setMenus((prev) => prev.filter((m) => m.id !== id));
  const handleSaved = (m: Menu) => {
    setMenus((prev) => {
      const exists = prev.some((p) => p.id === m.id);
      return exists
        ? prev.map((p) => (p.id === m.id ? m : p))
        : [m, ...prev];
    });
  };

  if (!hydrated) return null;

  return (
    <div className="relative min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-5 py-8 lg:py-12">
        {/* 로고 */}
        <motion.header
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h1
            className="font-display text-5xl font-bold tracking-tight text-black sm:text-6xl"
            style={{ letterSpacing: "0.02em" }}
          >
            TÀMH
          </h1>
          <p className="mt-2 font-display text-[10px] uppercase tracking-[0.35em] text-zinc-400 sm:text-xs">
            Single Malt · Cocktail · Bar
          </p>
        </motion.header>

        {/* 검색바 */}
        <div className="mb-5">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
              strokeWidth={1.8}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="메뉴 검색 (영문 / 한글)"
              className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-12 font-korean text-base text-black placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 active:scale-95"
                aria-label="검색어 지우기"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>

        {/* 검색 중이 아닐 때만 탭 표시 */}
        {!isSearching && (
          <>
            {/* 1차 큰 탭 (위스키 / 칵테일 / 푸드) */}
            <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
              {PRIMARY_GROUPS.map((g) => {
                const active = tab === g.key;
                return (
                  <button
                    key={g.key}
                    onClick={() => switchTab(g.key)}
                    className={cn(
                      "rounded-2xl px-4 py-5 transition-all active:scale-[0.97] sm:py-6",
                      active
                        ? "bg-black text-white shadow-lg"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900",
                    )}
                  >
                    <div
                      className={cn(
                        "font-korean text-lg font-bold sm:text-2xl",
                        active ? "text-white" : "text-black",
                      )}
                    >
                      {g.label}
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 font-display text-[10px] uppercase tracking-[0.25em] sm:text-xs",
                        active ? "text-white/60" : "text-zinc-400",
                      )}
                    >
                      {g.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2차 서브 태그 */}
            {categoriesInTab.length > 1 && (
              <div className="-mx-5 mb-6 overflow-x-auto px-5 pb-2 luxe-scroll">
                <div className="flex w-max gap-2">
                  <SubChip
                    active={sub === "all"}
                    onClick={() => switchSub("all")}
                  >
                    전체
                  </SubChip>
                  {categoriesInTab.map((c) => (
                    <SubChip
                      key={c.id}
                      active={sub === c.id}
                      onClick={() => switchSub(c.id)}
                    >
                      {c.name}
                    </SubChip>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 검색 중 안내 */}
        {isSearching && (
          <div className="mb-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="font-korean text-sm text-zinc-700">
              <Search className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={2} />
              <b>"{query}"</b> 검색 중 — 전체 카테고리에서 매칭된 메뉴를 보여줍니다.
            </p>
          </div>
        )}

        {/* 메뉴 섹션 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSearching ? "search-" + query : tab + sub}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            {grouped.map(({ category, menus: items }) => (
              <section key={category.id}>
                <header className="mb-3 flex items-baseline justify-between border-b border-zinc-200 pb-2">
                  <h2 className="font-display text-xl font-bold tracking-tight text-black sm:text-2xl">
                    {category.name}
                  </h2>
                  <span className="font-korean text-xs text-zinc-400">
                    {items.length}종
                  </span>
                </header>
                <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
                  {items.map((m) => (
                    <CleanMenuRow
                      key={m.id}
                      menu={m}
                      onUpdated={handleUpdated}
                      onDeleted={handleDeleted}
                      onEdit={(menu) => setEditingMenu(menu)}
                    />
                  ))}
                </ul>
              </section>
            ))}
            {grouped.length === 0 && (
              <p className="py-20 text-center font-korean italic text-zinc-400">
                {isSearching
                  ? `"${query}"에 매칭되는 메뉴가 없습니다.`
                  : "표시할 메뉴가 없습니다."}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 푸터 */}
        <footer className="mt-16 border-t border-zinc-200 pt-5 text-center">
          <p className="font-display text-[10px] uppercase tracking-[0.35em] text-zinc-400">
            Thank You · 감사합니다
          </p>
        </footer>
      </div>

      {/* 플로팅 + 추가 버튼 */}
      <button
        onClick={() => setCreating(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:bg-zinc-800 active:scale-95"
        aria-label="메뉴 추가"
        title="메뉴 추가"
      >
        <Plus className="h-7 w-7" strokeWidth={2.2} />
      </button>

      {/* 메뉴 추가 모달 */}
      <AnimatePresence>
        {creating && (
          <MenuFormModal
            categories={categories}
            onClose={() => setCreating(false)}
            onSaved={handleSaved}
          />
        )}
        {editingMenu && (
          <MenuFormModal
            categories={categories}
            menu={editingMenu}
            onClose={() => setEditingMenu(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// SubChip
// =========================================================
function SubChip({
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
        "h-11 shrink-0 rounded-full border px-5 font-korean text-sm font-medium transition-all active:scale-95",
        active
          ? "border-black bg-black text-white shadow-md"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900 hover:text-black",
      )}
    >
      {children}
    </button>
  );
}
