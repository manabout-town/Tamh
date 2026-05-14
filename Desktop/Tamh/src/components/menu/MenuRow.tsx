"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Loader2, Pencil, X, Eye, EyeOff, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, formatKRW, parseIntegerInput } from "@/lib/utils";
import type { Menu } from "@/types/database";

interface Props {
  menu: Menu;
  onUpdated: (m: Menu) => void;
  onDeleted?: (id: string) => void;
}

/**
 * 한 줄 메뉴 표시 — 영문 (필기체) · 한글 (고딕) · 잔가 · 병가 · 품절 토글
 */
export function MenuRow({ menu, onUpdated, onDeleted }: Props) {
  const soldOut = !menu.is_active;

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-4 px-5 py-3.5 transition-colors",
        soldOut ? "bg-charcoal-100/20" : "hover:bg-gold/[0.04]",
      )}
    >
      {/* 이름 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate font-display text-xl font-semibold tracking-tight",
              soldOut ? "text-ivory/35 line-through" : "text-ivory",
            )}
          >
            {menu.name}
          </p>
          {soldOut && (
            <span className="shrink-0 rounded-full border border-burgundy/50 bg-burgundy/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest2 text-burgundy">
              품절
            </span>
          )}
        </div>
        {menu.name_ko && (
          <p
            className={cn(
              "mt-0.5 truncate font-korean text-sm font-medium tracking-tight",
              soldOut ? "text-ivory/30" : "text-ivory/65",
            )}
          >
            {menu.name_ko}
          </p>
        )}
      </div>

      {/* 가격 (잔 / 병) */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 sm:gap-4",
          soldOut && "opacity-40",
        )}
      >
        <PriceCell menu={menu} field="price" label="잔" onUpdated={onUpdated} />
        <span className="text-ivory/25">/</span>
        <PriceCell menu={menu} field="bottle_price" label="병" onUpdated={onUpdated} />
      </div>

      {/* 품절 토글 + 삭제 */}
      <SoldOutToggle menu={menu} onUpdated={onUpdated} />
      {onDeleted && <DeleteButton menu={menu} onDeleted={onDeleted} />}
    </li>
  );
}

// =========================================================
// DeleteButton — 메뉴 영구 삭제 (확인 후)
// =========================================================
function DeleteButton({
  menu,
  onDeleted,
}: {
  menu: Menu;
  onDeleted: (id: string) => void;
}) {
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
    }
  };

  if (confirming) {
    return (
      <div className="ml-1 flex items-center gap-1 rounded-full border border-burgundy/50 bg-burgundy/10 px-1 py-1">
        <button
          onClick={doDelete}
          disabled={saving}
          className="rounded-full bg-burgundy px-2.5 py-1 font-korean text-[11px] font-semibold text-ivory"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "삭제"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-full px-2 py-1 font-korean text-[11px] text-ivory/70 hover:text-ivory"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-burgundy/30 text-burgundy/70 transition-all hover:border-burgundy hover:bg-burgundy/10 hover:text-burgundy active:scale-95"
      aria-label="메뉴 삭제"
      title="삭제"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.6} />
    </button>
  );
}

// =========================================================
// SoldOutToggle — 탭 한 번으로 품절/판매중 전환
// =========================================================
function SoldOutToggle({
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
      const { data, error } = await supabase
        .from("menus")
        .update({ is_active: !menu.is_active })
        .eq("id", menu.id)
        .select()
        .single();
      if (!error && data) onUpdated(data as Menu);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={cn(
        "ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all",
        "active:scale-95",
        soldOut
          ? "border-burgundy/50 bg-burgundy/15 text-burgundy hover:bg-burgundy/25"
          : "border-gold/25 text-ivory/50 hover:border-gold/50 hover:text-gold",
      )}
      aria-label={soldOut ? "판매 재개" : "품절 처리"}
      title={soldOut ? "판매 재개" : "품절 처리"}
    >
      {saving ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
      ) : soldOut ? (
        <EyeOff className="h-4 w-4" strokeWidth={1.8} />
      ) : (
        <Eye className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  );
}

// =========================================================
// PriceCell — 클릭 시 인라인 편집
// =========================================================
function PriceCell({
  menu,
  field,
  label,
  onUpdated,
}: {
  menu: Menu;
  field: "price" | "bottle_price";
  label: string;
  onUpdated: (m: Menu) => void;
}) {
  const value = menu[field];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(value != null ? String(value) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing]);

  const startEdit = () => {
    setDraft(value != null ? String(value) : "");
    setError(false);
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value != null ? String(value) : "");
    setError(false);
  };

  const save = async () => {
    const parsed = draft.trim() === "" ? null : parseIntegerInput(draft);
    if (parsed === value) {
      setEditing(false);
      return;
    }
    if (parsed != null && (parsed < 0 || parsed > 100_000_000)) {
      setError(true);
      return;
    }
    setSaving(true);
    setError(false);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: dbErr } = await supabase
        .from("menus")
        .update({ [field]: parsed } as any)
        .eq("id", menu.id)
        .select()
        .single();
      if (dbErr || !data) throw dbErr ?? new Error("update failed");
      onUpdated(data as Menu);
      setEditing(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1100);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      cancel();
    }
  };

  const allowEmpty = field === "bottle_price";

  return (
    <div className="relative inline-flex items-center">
      {!editing ? (
        <button
          onClick={startEdit}
          className={cn(
            "group inline-flex items-center gap-1 rounded-md px-2 py-1 font-serif text-base transition-all",
            value != null ? "text-gold" : "text-ivory/30",
            "hover:bg-gold/10 hover:text-gold",
            savedFlash && "bg-emerald-400/15 text-emerald-300",
          )}
          aria-label={`${label} 가격 수정`}
        >
          <span className="font-korean text-[10px] uppercase tracking-widest2 text-ivory/40">
            {label}
          </span>
          <span className="min-w-[3.5rem] text-right tabular-nums">
            {value != null ? `₩${formatKRW(value)}` : "—"}
          </span>
          <Pencil
            className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={1.5}
          />
        </button>
      ) : (
        <div
          className={cn(
            "flex items-center gap-1 rounded-md border bg-charcoal-200/80 px-2 py-1 ring-1",
            error
              ? "border-burgundy ring-burgundy/40"
              : "border-gold/60 ring-gold/30",
          )}
        >
          <span className="font-korean text-[10px] uppercase tracking-widest2 text-gold/80">
            {label}
          </span>
          <span className="text-gold/80">₩</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
            onKeyDown={onKeyDown}
            onBlur={() => {
              if (!allowEmpty && draft.trim() === "") {
                cancel();
                return;
              }
              save();
            }}
            placeholder={allowEmpty ? "(없음)" : "0"}
            className="w-24 bg-transparent font-serif text-base text-ivory tabular-nums focus:outline-none"
          />
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" strokeWidth={1.8} />
          ) : (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={save}
                className="rounded p-0.5 text-emerald-400 hover:bg-emerald-400/15"
                aria-label="저장"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={cancel}
                className="rounded p-0.5 text-ivory/60 hover:bg-ivory/10"
                aria-label="취소"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
