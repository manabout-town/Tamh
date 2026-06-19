"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Star, Search, Tag } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, formatKRW, parseIntegerInput } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";
import { groupOf } from "@/lib/category-groups";

interface Props {
  categories: Category[];
  menus: Menu[];
  onClose: () => void;
  onUpdated: (m: Menu) => void;
}

export function WeeklyEventModal({ categories, menus, onClose, onUpdated }: Props) {
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const whiskeyMenus = useMemo(() => {
    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const q = query.trim().toLowerCase();
    return menus
      .filter((m) => {
        const catName = catMap.get(m.category_id) ?? "";
        if (groupOf(catName) !== "whisky") return false;
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          (m.name_ko ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.is_recommended && !b.is_recommended) return -1;
        if (!a.is_recommended && b.is_recommended) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [menus, categories, query]);

  const weeklyCount = menus.filter((m) => m.is_recommended).length;

  const toggleWeekly = async (menu: Menu) => {
    setSaving((s) => new Set(s).add(menu.id));
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("menus")
        .update({ is_recommended: !menu.is_recommended })
        .eq("id", menu.id)
        .select()
        .single();
      if (data) onUpdated(data as Menu);
    } finally {
      setSaving((s) => {
        const next = new Set(s);
        next.delete(menu.id);
        return next;
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="fixed inset-x-4 top-8 z-50 mx-auto flex max-h-[86vh] max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-amber-500">
              Weekly Event
            </p>
            <h3 className="mt-0.5 font-korean text-xl font-bold text-black">
              위클리 이벤트 관리
            </h3>
            <p className="mt-0.5 font-korean text-xs text-zinc-400">
              현재 {weeklyCount}개 선택 · 이벤트가격은 별 항목에서 설정
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* 검색 */}
        <div className="shrink-0 px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="위스키 검색"
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 font-korean text-sm text-black placeholder:text-zinc-400 focus:border-black focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* 목록 */}
        <ul className="flex-1 divide-y divide-zinc-50 overflow-y-auto">
          {whiskeyMenus.map((m) => (
            <WeeklyRow
              key={m.id}
              menu={m}
              isSaving={saving.has(m.id)}
              onToggle={toggleWeekly}
              onUpdated={onUpdated}
            />
          ))}
          {whiskeyMenus.length === 0 && (
            <li className="py-12 text-center font-korean text-sm text-zinc-400">
              검색 결과가 없습니다.
            </li>
          )}
        </ul>

        <div className="shrink-0 border-t border-zinc-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-black py-3.5 font-korean text-sm font-semibold text-white hover:bg-zinc-800 active:scale-[0.98]"
          >
            완료
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────
// WeeklyRow — 항목별 행 (토글 + 이벤트가격 편집)
// ─────────────────────────────────────────
function WeeklyRow({
  menu,
  isSaving,
  onToggle,
  onUpdated,
}: {
  menu: Menu;
  isSaving: boolean;
  onToggle: (m: Menu) => void;
  onUpdated: (m: Menu) => void;
}) {
  return (
    <li className={cn("px-6 transition-colors", menu.is_recommended ? "bg-amber-50/50" : "")}>
      {/* 상단: 이름 + 원가격 + 추가/제거 버튼 */}
      <div className="flex items-center gap-3 py-3.5">
        <Star
          className={cn(
            "h-4 w-4 shrink-0",
            menu.is_recommended ? "fill-amber-400 text-amber-400" : "text-zinc-200"
          )}
          strokeWidth={1.5}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-black">{menu.name}</p>
          {menu.name_ko && (
            <p className="truncate font-korean text-xs text-zinc-400">{menu.name_ko}</p>
          )}
        </div>
        <span className="shrink-0 font-korean text-xs tabular-nums text-zinc-400">
          ₩{formatKRW(menu.price)}
        </span>
        <button
          onClick={() => onToggle(menu)}
          disabled={isSaving}
          className={cn(
            "shrink-0 rounded-xl px-3.5 py-2 font-korean text-xs font-bold transition-all active:scale-95 disabled:opacity-50",
            menu.is_recommended
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          )}
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
          ) : menu.is_recommended ? (
            "제거"
          ) : (
            "추가"
          )}
        </button>
      </div>

      {/* 이벤트가격 편집 — 위클리 항목에만 표시 */}
      {menu.is_recommended && (
        <div className="pb-3.5">
          <EventPriceEditor menu={menu} onUpdated={onUpdated} />
        </div>
      )}
    </li>
  );
}

// ─────────────────────────────────────────
// EventPriceEditor — 이벤트가격 인라인 편집
// ─────────────────────────────────────────
function EventPriceEditor({
  menu,
  onUpdated,
}: {
  menu: Menu;
  onUpdated: (m: Menu) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    menu.event_price != null ? String(menu.event_price) : ""
  );
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = async () => {
    const parsed = draft.trim() === "" ? null : parseIntegerInput(draft);
    if (parsed === menu.event_price) return setEditing(false);
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("menus")
        .update({ event_price: parsed })
        .eq("id", menu.id)
        .select()
        .single();
      if (data) onUpdated(data as Menu);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5">
      <Tag className="h-3.5 w-3.5 shrink-0 text-amber-500" strokeWidth={2} />
      <span className="font-korean text-xs text-zinc-500 shrink-0">이벤트가격</span>

      {editing ? (
        <div className="flex flex-1 items-center gap-1">
          <span className="font-korean text-xs text-zinc-400">₩</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
            onBlur={save}
            placeholder="미설정"
            className="flex-1 bg-transparent font-korean text-sm font-bold tabular-nums text-black focus:outline-none"
          />
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" strokeWidth={2} />}
        </div>
      ) : (
        <button
          onClick={() => {
            setDraft(menu.event_price != null ? String(menu.event_price) : "");
            setEditing(true);
          }}
          className="flex-1 text-left font-korean text-sm font-bold tabular-nums text-black hover:text-amber-600"
        >
          {menu.event_price != null ? `₩${formatKRW(menu.event_price)}` : (
            <span className="text-xs font-normal text-zinc-400">탭하여 이벤트가격 설정</span>
          )}
        </button>
      )}

      {/* 원가격 참고 표시 */}
      <span className="shrink-0 font-korean text-[10px] text-zinc-400">
        원가 ₩{formatKRW(menu.price)}
      </span>
    </div>
  );
}
