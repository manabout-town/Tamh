"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, X, MoreVertical, Trash2, Pencil, Wine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, formatKRW, parseIntegerInput } from "@/lib/utils";
import type { Menu } from "@/types/database";

interface Props {
  menu: Menu;
  onUpdated: (m: Menu) => void;
  onDeleted: (id: string) => void;
  onEdit: (menu: Menu) => void;
}

/**
 * CleanMenuRow — iPad 친화 라이트 메뉴 행
 *
 * 레이아웃 (왼 → 오른쪽):
 *   [이름 / 한글]   [잔 가격(고딕)]   [병▾]   [⋮]   [☐ 품절]
 *
 * • 잔 가격: 탭하면 인라인 편집
 * • 병: 작은 버튼 → 탭하면 병 가격 팝업
 * • ⋮: 수정 / 삭제 메뉴
 * • 우측 끝 체크박스: 품절 토글 (체크 = 품절)
 */
export function CleanMenuRow({ menu, onUpdated, onDeleted, onEdit }: Props) {
  const soldOut = !menu.is_active;

  return (
    <li
      className={cn(
        "flex items-center gap-2 px-4 py-3.5 transition-colors sm:gap-3 sm:px-5 sm:py-4",
        soldOut ? "bg-zinc-50/70" : "hover:bg-zinc-50",
      )}
    >
      {/* 이름 영역 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate font-display text-base font-semibold sm:text-lg",
              soldOut ? "text-zinc-400 line-through" : "text-black",
            )}
          >
            {menu.name}
          </p>
          {soldOut && (
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 font-korean text-[10px] font-bold text-red-700">
              품절
            </span>
          )}
        </div>
        {menu.name_ko && (
          <p
            className={cn(
              "mt-0.5 truncate font-korean text-sm font-medium",
              soldOut ? "text-zinc-300" : "text-zinc-500",
            )}
          >
            {menu.name_ko}
          </p>
        )}
      </div>

      {/* 잔 가격 (인라인 편집, 고딕 숫자) */}
      <PriceCell menu={menu} field="price" onUpdated={onUpdated} disabled={soldOut} />

      {/* 병 가격 — 버튼으로 노출 */}
      {menu.bottle_price != null && (
        <BottleButton menu={menu} onUpdated={onUpdated} />
      )}

      {/* 점3개 메뉴 — 수정/삭제 */}
      <RowMenu menu={menu} onEdit={onEdit} onDeleted={onDeleted} />

      {/* 우측 끝 — 품절 체크박스 */}
      <SoldOutCheckbox menu={menu} onUpdated={onUpdated} />
    </li>
  );
}

// =========================================================
// SoldOutCheckbox — 우측 끝, 1탭 체크박스 (체크 = 품절)
// =========================================================
function SoldOutCheckbox({
  menu,
  onUpdated,
}: {
  menu: Menu;
  onUpdated: (m: Menu) => void;
}) {
  const [saving, setSaving] = useState(false);
  const soldOut = !menu.is_active;

  const toggle = async () => {
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("menus")
        .update({ is_active: !menu.is_active })
        .eq("id", menu.id)
        .select()
        .single();
      if (data) onUpdated(data as Menu);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className="ml-1 flex shrink-0 items-center gap-2 active:scale-95"
      aria-label={soldOut ? "판매 재개" : "품절 처리"}
      title={soldOut ? "탭하여 판매 재개" : "탭하여 품절 처리"}
    >
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border-2 transition-colors",
          soldOut
            ? "border-red-500 bg-red-500 text-white"
            : "border-zinc-300 bg-white text-transparent",
        )}
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin text-zinc-500" strokeWidth={2} />
        ) : (
          <Check className="h-5 w-5" strokeWidth={3} />
        )}
      </span>
      <span
        className={cn(
          "hidden font-korean text-xs font-semibold sm:inline",
          soldOut ? "text-red-700" : "text-zinc-400",
        )}
      >
        품절
      </span>
    </button>
  );
}

// =========================================================
// BottleButton — 작은 [병] 버튼 → 탭 시 병 가격 팝오버
// =========================================================
function BottleButton({
  menu,
  onUpdated,
}: {
  menu: Menu;
  onUpdated: (m: Menu) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-full border px-3 font-korean text-xs font-semibold transition-all active:scale-95",
          open
            ? "border-black bg-black text-white"
            : "border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black",
        )}
        aria-label="병 가격 보기"
      >
        <Wine className="h-3.5 w-3.5" strokeWidth={1.8} />
        병
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* 배경 클릭 시 닫힘 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ y: 6, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 6, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 min-w-[180px] rounded-xl border border-zinc-200 bg-white p-3 shadow-2xl"
            >
              <p className="font-korean text-[10px] uppercase tracking-widest text-zinc-400">
                Bottle Price
              </p>
              <BottlePriceInline menu={menu} onUpdated={onUpdated} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// 병 가격도 인라인 편집 가능
function BottlePriceInline({
  menu,
  onUpdated,
}: {
  menu: Menu;
  onUpdated: (m: Menu) => void;
}) {
  const value = menu.bottle_price;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value != null ? String(value) : "");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing]);

  const save = async () => {
    const parsed = draft.trim() === "" ? null : parseIntegerInput(draft);
    if (parsed === value) return setEditing(false);
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("menus")
        .update({ bottle_price: parsed })
        .eq("id", menu.id)
        .select()
        .single();
      if (data) onUpdated(data as Menu);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="mt-1 block w-full rounded-md p-1 text-left font-korean text-xl font-bold tabular-nums text-black hover:bg-zinc-50"
      >
        {value != null ? `₩${formatKRW(value)}` : "병 가격 추가"}
      </button>
    );
  }

  return (
    <div className="mt-1 flex items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1">
      <span className="font-korean text-sm text-zinc-500">₩</span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        onBlur={save}
        className="flex-1 bg-transparent font-korean text-lg font-bold tabular-nums text-black focus:outline-none"
      />
      {saving && (
        <Loader2 className="h-4 w-4 animate-spin text-black" strokeWidth={2} />
      )}
    </div>
  );
}

// =========================================================
// PriceCell — 잔 가격 인라인 편집 (고딕)
// =========================================================
function PriceCell({
  menu,
  field,
  onUpdated,
  disabled,
}: {
  menu: Menu;
  field: "price";
  onUpdated: (m: Menu) => void;
  disabled?: boolean;
}) {
  const value = menu[field];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing]);

  const save = async () => {
    const parsed = parseIntegerInput(draft);
    if (parsed === value) return setEditing(false);
    if (parsed == null || parsed < 0) return;
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("menus")
        .update({ price: parsed })
        .eq("id", menu.id)
        .select()
        .single();
      if (data) {
        onUpdated(data as Menu);
        setEditing(false);
        setFlash(true);
        setTimeout(() => setFlash(false), 900);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => {
          setDraft(String(menu.price));
          setEditing(true);
        }}
        className={cn(
          "shrink-0 rounded-md px-2 py-1 font-korean text-lg font-bold tabular-nums transition-all active:scale-95 sm:text-xl",
          flash
            ? "bg-emerald-100 text-emerald-700"
            : "text-black hover:bg-zinc-100",
          disabled && "opacity-50",
        )}
        aria-label="잔 가격 수정"
      >
        ₩{formatKRW(value)}
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1 rounded-md border-2 border-black bg-white px-2 py-1">
      <span className="font-korean text-sm text-zinc-500">₩</span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        }}
        onBlur={save}
        className="w-24 bg-transparent font-korean text-lg font-bold tabular-nums text-black focus:outline-none sm:text-xl"
      />
      {saving && (
        <Loader2 className="h-4 w-4 animate-spin text-black" strokeWidth={2} />
      )}
    </div>
  );
}

// =========================================================
// RowMenu — ⋮ → 수정 / 삭제
// =========================================================
function RowMenu({
  menu,
  onEdit,
  onDeleted,
}: {
  menu: Menu;
  onEdit: (menu: Menu) => void;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  const doDelete = async () => {
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("menus").delete().eq("id", menu.id);
      if (!error) onDeleted(menu.id);
    } finally {
      setSaving(false);
      setConfirming(false);
      setOpen(false);
    }
  };

  const close = () => {
    setOpen(false);
    setConfirming(false);
  };

  const handleEdit = () => {
    setOpen(false);
    onEdit(menu);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 active:scale-95"
        aria-label="더 보기"
      >
        <MoreVertical className="h-5 w-5" strokeWidth={1.6} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30"
              onClick={close}
            />
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed inset-x-6 top-1/3 z-50 mx-auto max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            >
              <p className="font-display text-lg font-bold text-black">
                {menu.name}
              </p>
              {menu.name_ko && (
                <p className="mt-0.5 font-korean text-sm text-zinc-500">
                  {menu.name_ko}
                </p>
              )}

              <div className="mt-5 space-y-2">
                {!confirming ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-zinc-300 bg-white px-5 py-4 font-korean text-base font-semibold text-zinc-800 active:scale-[0.98]"
                    >
                      <Pencil className="h-5 w-5" strokeWidth={1.8} />
                      메뉴 수정
                    </button>
                    <button
                      onClick={() => setConfirming(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-4 font-korean text-base font-semibold text-red-700 active:scale-[0.98]"
                    >
                      <Trash2 className="h-5 w-5" strokeWidth={1.8} />
                      메뉴 삭제
                    </button>
                  </>
                ) : (
                  <>
                    <p className="rounded-lg bg-red-50 px-3 py-2.5 font-korean text-sm text-red-800">
                      정말 삭제하시겠습니까? 되돌릴 수 없습니다.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirming(false)}
                        className="flex-1 rounded-xl border border-zinc-300 bg-white px-5 py-3 font-korean text-base font-medium text-zinc-700 active:scale-[0.98]"
                      >
                        취소
                      </button>
                      <button
                        onClick={doDelete}
                        disabled={saving}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-5 py-3 font-korean text-base font-semibold text-white active:scale-[0.98]"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" strokeWidth={2.4} />
                        )}
                        삭제 확정
                      </button>
                    </div>
                  </>
                )}
                <button
                  onClick={close}
                  className="w-full rounded-xl py-3 font-korean text-sm text-zinc-500"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
