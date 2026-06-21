"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, Star, Settings2, XCircle, Lock, LockOpen } from "lucide-react";
import Link from "next/link";
import type { Category, Menu } from "@/types/database";
import { PRIMARY_GROUPS, groupOf, CATEGORY_DISPLAY_NAMES, type GroupKey } from "@/lib/category-groups";
import { CleanMenuRow } from "./CleanMenuRow";
import { MenuCardGrid } from "./MenuCardGrid";
import { MenuFormModal } from "./MenuFormModal";
import { WeeklyEventModal } from "./WeeklyEventModal";
import { PinModal } from "./PinModal";
import { useAdminMode } from "@/lib/use-admin-mode";
import { cn, formatKRW } from "@/lib/utils";

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
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const { isAdmin, unlock, lock } = useAdminMode();

  useEffect(() => {
    const savedTab = localStorage.getItem(TAB_KEY) as GroupKey | null;
    const savedSub = localStorage.getItem(SUB_KEY);
    if (savedTab && PRIMARY_GROUPS.some((g) => g.key === savedTab)) setTab(savedTab);
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

  const groupDef = PRIMARY_GROUPS.find((g) => g.key === tab)!;

  const categoriesInTab = useMemo(() => {
    const byName = new Map(categories.map((c) => [c.name, c]));
    return groupDef.categoryNames
      .map((n) => byName.get(n))
      .filter((c): c is Category => !!c);
  }, [categories, groupDef]);

  // "Signature" 카테고리 ID (Weekly Event 로직에 사용)
  const signatureCatId = useMemo(
    () => categories.find((c) => c.name === "Signature")?.id ?? null,
    [categories]
  );

  const isSearching = query.trim().length > 0;
  const isWeeklySub = !isSearching && sub === signatureCatId && tab === "whisky";

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const catMap = new Map(categories.map((c) => [c.id, c.name]));

    // Weekly Event 서브탭: is_recommended whisky 항목 전체를 단일 섹션으로
    if (isWeeklySub) {
      const weeklyItems = menus.filter((m) => {
        if (!m.is_recommended) return false;
        return groupOf(catMap.get(m.category_id) ?? "") === "whisky";
      });
      if (weeklyItems.length === 0) return [];
      const sigCat = categories.find((c) => c.id === signatureCatId)!;
      return [{ category: sigCat, menus: weeklyItems, isWeekly: true }];
    }

    const map = new Map<string, Menu[]>();
    menus
      .filter((m) => {
        if (isSearching) {
          return (
            m.name.toLowerCase().includes(q) ||
            (m.name_ko ?? "").toLowerCase().includes(q)
          );
        }
        const catName = catMap.get(m.category_id) ?? "";
        if (groupOf(catName) !== tab) return false;
        if (sub !== "all" && m.category_id !== sub) return false;
        return true;
      })
      .forEach((m) => {
        if (!map.has(m.category_id)) map.set(m.category_id, []);
        map.get(m.category_id)!.push(m);
      });

    const sourceCategories = isSearching
      ? [...categories].sort((a, b) => a.priority - b.priority)
      : categoriesInTab;

    return sourceCategories
      .map((c) => ({ category: c, menus: map.get(c.id) ?? [], isWeekly: false }))
      .filter((g) => g.menus.length > 0);
  }, [menus, categories, tab, sub, query, isSearching, categoriesInTab, signatureCatId, isWeeklySub]);

  const handleUpdated = (m: Menu) =>
    setMenus((prev) => prev.map((p) => (p.id === m.id ? m : p)));
  const handleDeleted = (id: string) =>
    setMenus((prev) => prev.filter((m) => m.id !== id));
  const handleSaved = (m: Menu) =>
    setMenus((prev) => {
      const exists = prev.some((p) => p.id === m.id);
      return exists ? prev.map((p) => (p.id === m.id ? m : p)) : [m, ...prev];
    });

  if (!hydrated) return null;

  return (
    <div className="relative min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-5 py-8 lg:py-12">

        {/* 관리 툴바 */}
        <div className="mb-5 flex items-center justify-end gap-2">
          {isAdmin && (
            <>
              <Link
                href="/soldout"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 px-4 font-korean text-xs font-semibold text-zinc-600 transition-all hover:border-zinc-900 hover:text-black active:scale-95"
              >
                <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                품절 관리
              </Link>
              <Link
                href="/detail"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 px-4 font-korean text-xs font-semibold text-zinc-600 transition-all hover:border-zinc-900 hover:text-black active:scale-95"
              >
                <Star className="h-3.5 w-3.5" strokeWidth={2} />
                디테일 보기
              </Link>
            </>
          )}
          <button
            onClick={() => isAdmin ? lock() : setPinOpen(true)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95",
              isAdmin
                ? "border-black bg-black text-white hover:bg-zinc-800"
                : "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-900 hover:text-black",
            )}
            aria-label={isAdmin ? "관리자 잠금" : "관리자 잠금 해제"}
          >
            {isAdmin
              ? <LockOpen className="h-4 w-4" strokeWidth={2} />
              : <Lock className="h-4 w-4" strokeWidth={2} />
            }
          </button>
        </div>

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

        {!isSearching && (
          <>
            {/* 1차 큰 탭 */}
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
                    <div className={cn("font-korean text-lg font-bold sm:text-2xl", active ? "text-white" : "text-black")}>
                      {g.label}
                    </div>
                    <div className={cn("mt-0.5 font-display text-[10px] uppercase tracking-[0.25em] sm:text-xs", active ? "text-white/60" : "text-zinc-400")}>
                      {g.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2차 서브 태그 */}
            {categoriesInTab.length > 1 && (
              <div className="-mx-5 mb-6 overflow-x-auto px-5 pb-2 luxe-scroll">
                <div className="flex w-max items-center gap-2">
                  <SubChip active={sub === "all"} onClick={() => switchSub("all")}>
                    전체
                  </SubChip>
                  {categoriesInTab.map((c) => {
                    const displayName = CATEGORY_DISPLAY_NAMES[c.name] ?? c.name;
                    const isWeeklyChip = c.id === signatureCatId;
                    const isActive = sub === c.id;
                    return (
                      <div key={c.id} className="flex items-center gap-1">
                        <SubChip
                          active={isActive}
                          weekly={isWeeklyChip}
                          onClick={() => switchSub(c.id)}
                        >
                          {isWeeklyChip && (
                            <Star
                              className={cn(
                                "mr-1 inline h-3.5 w-3.5",
                                isActive ? "fill-amber-300 text-amber-300" : "fill-amber-400 text-amber-400"
                              )}
                              strokeWidth={1.5}
                            />
                          )}
                          {displayName}
                        </SubChip>
                        {/* 위클리 이벤트 서브탭에 관리 버튼 */}
                        {isWeeklyChip && isActive && isAdmin && (
                          <button
                            onClick={() => setWeeklyOpen(true)}
                            className="inline-flex h-9 items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 font-korean text-xs font-semibold text-amber-700 transition-all hover:border-amber-500 hover:bg-amber-100 active:scale-95"
                          >
                            <Settings2 className="h-3.5 w-3.5" strokeWidth={2} />
                            관리
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

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
            {grouped.map(({ category, menus: items, isWeekly }) => (
              <section key={category.id}>
                <header className="mb-3 flex items-baseline justify-between border-b border-zinc-200 pb-2">
                  <h2 className="font-display text-xl font-bold tracking-tight text-black sm:text-2xl">
                    {isWeekly
                      ? "Weekly Event"
                      : (CATEGORY_DISPLAY_NAMES[category.name] ?? category.name)}
                  </h2>
                  <span className="font-korean text-xs text-zinc-400">{items.length}종</span>
                </header>

                {/* 칵테일 / 푸드 : 카드 그리드 */}
                {(tab === "cocktail" || tab === "food") ? (
                  <MenuCardGrid menus={items} type={tab} />
                ) : (
                  /* 위스키 / 위클리이벤트 : 리스트 */
                  isWeekly ? (
                    <ul className="divide-y divide-zinc-100 rounded-2xl border border-amber-200 bg-amber-50/30">
                      {items.map((m) => (
                        <WeeklyListRow key={m.id} menu={m} />
                      ))}
                    </ul>
                  ) : (
                    <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
                      {items.map((m) => (
                        <CleanMenuRow
                          key={m.id}
                          menu={m}
                          adminMode={isAdmin}
                          onUpdated={handleUpdated}
                          onDeleted={handleDeleted}
                          onEdit={(menu) => setEditingMenu(menu)}
                        />
                      ))}
                    </ul>
                  )
                )}
              </section>
            ))}

            {grouped.length === 0 && (
              <div className="py-20 text-center">
                {isWeeklySub ? (
                  <div>
                    <Star className="mx-auto mb-3 h-10 w-10 text-amber-300" strokeWidth={1.2} />
                    <p className="font-korean text-sm text-zinc-400">
                      위클리 이벤트 항목이 없습니다
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => setWeeklyOpen(true)}
                        className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-5 font-korean text-sm font-semibold text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
                      >
                        <Settings2 className="h-4 w-4" strokeWidth={2} />
                        관리에서 추가하기
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="font-korean italic text-zinc-400">
                    {isSearching ? `"${query}"에 매칭되는 메뉴가 없습니다.` : "표시할 메뉴가 없습니다."}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-16 border-t border-zinc-200 pt-5 text-center">
          <p className="font-display text-[10px] uppercase tracking-[0.35em] text-zinc-400">
            Thank You · 감사합니다
          </p>
        </footer>
      </div>

      {/* 플로팅 + 추가 (관리자 전용) */}
      {isAdmin && (
        <button
          onClick={() => setCreating(true)}
          className="fixed bottom-6 right-6 z-30 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:bg-zinc-800 active:scale-95"
          aria-label="메뉴 추가"
        >
          <Plus className="h-7 w-7" strokeWidth={2.2} />
        </button>
      )}

      <AnimatePresence>
        {pinOpen && (
          <PinModal
            onUnlock={(pin) => {
              const ok = unlock(pin);
              if (ok) setPinOpen(false);
              return ok;
            }}
            onClose={() => setPinOpen(false)}
          />
        )}
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
        {weeklyOpen && (
          <WeeklyEventModal
            categories={categories}
            menus={menus}
            onClose={() => setWeeklyOpen(false)}
            onUpdated={handleUpdated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// WeeklyListRow — 위클리 이벤트 항목 행
// ─────────────────────────────────────────
function WeeklyListRow({ menu }: { menu: Menu }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" strokeWidth={1.5} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-semibold text-black">{menu.name}</p>
        {menu.name_ko && (
          <p className="truncate font-korean text-xs text-zinc-400">{menu.name_ko}</p>
        )}
      </div>
      <div className="shrink-0 text-right">
        {menu.event_price != null ? (
          <>
            <p className="font-korean text-xs tabular-nums text-zinc-400 line-through">
              ₩{formatKRW(menu.price)}
            </p>
            <p className="font-korean text-sm font-bold tabular-nums text-amber-600">
              ₩{formatKRW(menu.event_price)}
            </p>
          </>
        ) : (
          <p className="font-korean text-sm font-bold tabular-nums text-black">
            ₩{formatKRW(menu.price)}
          </p>
        )}
        {menu.bottle_price && (
          <p className="font-korean text-[10px] tabular-nums text-zinc-400">
            병 ₩{formatKRW(menu.bottle_price)}
          </p>
        )}
      </div>
    </li>
  );
}

// ─────────────────────────────────────────
// SubChip
// ─────────────────────────────────────────
function SubChip({
  active,
  weekly,
  onClick,
  children,
}: {
  active: boolean;
  weekly?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 rounded-full border px-5 font-korean text-sm font-medium transition-all active:scale-95",
        active && weekly
          ? "border-amber-500 bg-amber-500 text-white shadow-md"
          : active
          ? "border-black bg-black text-white shadow-md"
          : weekly
          ? "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900 hover:text-black",
      )}
    >
      {children}
    </button>
  );
}
