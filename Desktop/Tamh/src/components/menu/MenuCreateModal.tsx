"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Save, Sparkles } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, parseIntegerInput } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";

interface Props {
  categories: Category[];
  onClose: () => void;
  onCreated: (m: Menu) => void;
}

export function MenuCreateModal({ categories, onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    category_id: categories[0]?.id ?? "",
    name: "",
    name_ko: "",
    price: "",
    bottle_price: "",
    description: "",
    is_recommended: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.category_id) {
      setError("카테고리를 선택해주세요.");
      return;
    }
    if (!form.name.trim()) {
      setError("영문 이름을 입력해주세요.");
      return;
    }
    const priceNum = parseIntegerInput(form.price);
    if (priceNum == null || priceNum < 0) {
      setError("가격(잔)을 올바르게 입력해주세요.");
      return;
    }
    const bottleNum = form.bottle_price.trim()
      ? parseIntegerInput(form.bottle_price)
      : null;

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: dbErr } = await supabase
        .from("menus")
        .insert({
          category_id: form.category_id,
          name: form.name.trim(),
          name_ko: form.name_ko.trim() || null,
          price: priceNum,
          bottle_price: bottleNum,
          description: form.description.trim() || null,
          is_active: true,
          is_recommended: form.is_recommended,
        })
        .select()
        .single();
      if (dbErr || !data) throw dbErr ?? new Error("insert failed");
      onCreated(data as Menu);
      onClose();
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "메뉴 추가에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-x-4 top-12 z-50 mx-auto max-h-[88vh] max-w-xl overflow-y-auto rounded-2xl border border-gold/25 bg-charcoal-200/95 p-7 backdrop-blur-luxe luxe-scroll"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-display text-xs uppercase tracking-widest2 text-gold">
              New Menu
            </p>
            <h3 className="font-korean mt-1 text-2xl font-bold text-ivory">
              메뉴 추가
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ivory/60 hover:bg-charcoal-100 hover:text-gold"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="카테고리 *">
            <select
              required
              value={form.category_id}
              onChange={(e) => update("category_id", e.target.value)}
              className={INPUT}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="영문 이름 *">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="예: Macallan 25y"
                className={cn(INPUT, "font-display text-lg")}
              />
            </Field>
            <Field label="한글 이름">
              <input
                value={form.name_ko}
                onChange={(e) => update("name_ko", e.target.value)}
                placeholder="예: 맥켈란 25년"
                className={cn(INPUT, "font-korean")}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="잔 가격 (원) *">
              <input
                required
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.price}
                onChange={(e) =>
                  update("price", e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="18000"
                className={cn(INPUT, "tabular-nums")}
              />
            </Field>
            <Field label="병 가격 (원, 선택)">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.bottle_price}
                onChange={(e) =>
                  update("bottle_price", e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="(공란 가능)"
                className={cn(INPUT, "tabular-nums")}
              />
            </Field>
          </div>

          <Field label="설명 (선택)">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="짧은 설명이나 노트…"
              className={cn(INPUT, "resize-y font-korean leading-relaxed")}
            />
          </Field>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gold/15 bg-charcoal-100/40 px-3 py-2">
            <input
              type="checkbox"
              checked={form.is_recommended}
              onChange={(e) => update("is_recommended", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
            <span className="font-korean text-sm text-ivory/85">
              시그니처 / 추천 메뉴로 표시
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-burgundy/40 bg-burgundy/10 p-3 font-korean text-sm text-ivory/85">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gold/15 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gold/25 px-5 py-2.5 font-korean text-sm font-medium text-ivory/80 hover:border-gold/60 hover:text-gold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-korean text-sm font-semibold text-charcoal-900 shadow-gold-glow disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" strokeWidth={2} />
              )}
              추가하기
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

const INPUT =
  "w-full rounded-lg border border-gold/20 bg-charcoal-100/60 px-4 py-2.5 text-base text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-korean text-xs font-medium uppercase tracking-widest2 text-gold/80">
        {label}
      </span>
      {children}
    </label>
  );
}
