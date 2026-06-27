"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Save, Sparkles, Plus } from "lucide-react";
import { adminCreateMenu, adminUpdateMenu } from "@/lib/admin-api";
import { cn, parseIntegerInput } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";

interface Props {
  categories: Category[];
  /** 있으면 수정 모드, 없으면 생성 모드 */
  menu?: Menu;
  onClose: () => void;
  onSaved: (m: Menu) => void;
}

/**
 * MenuFormModal — 메뉴 생성 / 수정 통합 모달.
 * iPad 라이트 테마, 큰 터치 타깃.
 */
export function MenuFormModal({ categories, menu, onClose, onSaved }: Props) {
  const isEdit = !!menu;
  const [form, setForm] = useState({
    category_id: menu?.category_id ?? categories[0]?.id ?? "",
    name: menu?.name ?? "",
    name_ko: menu?.name_ko ?? "",
    price: menu ? String(menu.price) : "",
    bottle_price: menu?.bottle_price != null ? String(menu.bottle_price) : "",
    description: menu?.description ?? "",
    is_recommended: menu?.is_recommended ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.category_id) return setError("카테고리를 선택해주세요.");
    if (!form.name.trim()) return setError("영문 이름을 입력해주세요.");

    const priceNum = parseIntegerInput(form.price);
    if (priceNum == null || priceNum < 0) {
      return setError("잔 가격을 올바르게 입력해주세요.");
    }
    const bottleNum = form.bottle_price.trim()
      ? parseIntegerInput(form.bottle_price)
      : null;

    setSaving(true);
    try {
      const payload = {
        category_id: form.category_id,
        name: form.name.trim(),
        name_ko: form.name_ko.trim() || null,
        price: priceNum,
        bottle_price: bottleNum,
        description: form.description.trim() || null,
        is_recommended: form.is_recommended,
      };

      const saved = isEdit
        ? await adminUpdateMenu(menu!.id, payload)
        : await adminCreateMenu({ ...payload, is_active: true } as any);

      onSaved(saved);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "저장에 실패했습니다.");
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
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-x-4 top-8 z-50 mx-auto max-h-[88vh] max-w-xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-7 shadow-2xl luxe-scroll"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-zinc-400">
              {isEdit ? "Edit Menu" : "New Menu"}
            </p>
            <h3 className="mt-1 font-korean text-2xl font-bold text-black">
              {isEdit ? "메뉴 수정" : "메뉴 추가"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
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
                placeholder="Macallan 25y"
                className={cn(INPUT, "font-display text-lg font-semibold")}
              />
            </Field>
            <Field label="한글 이름">
              <input
                value={form.name_ko}
                onChange={(e) => update("name_ko", e.target.value)}
                placeholder="맥켈란 25년"
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
                className={cn(INPUT, "font-korean tabular-nums")}
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
                className={cn(INPUT, "font-korean tabular-nums")}
              />
            </Field>
          </div>

          <Field label="설명 (선택)">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="짧은 설명…"
              className={cn(INPUT, "resize-y font-korean leading-relaxed")}
            />
          </Field>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <input
              type="checkbox"
              checked={form.is_recommended}
              onChange={(e) => update("is_recommended", e.target.checked)}
              className="h-5 w-5 accent-black"
            />
            <Sparkles className="h-4 w-4 text-amber-500" strokeWidth={1.6} />
            <span className="font-korean text-sm font-medium text-zinc-700">
              위클리 이벤트 배너에 표시
            </span>
          </label>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 font-korean text-sm text-red-800">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-300 px-5 py-3 font-korean text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 font-korean text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                <Save className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2.4} />
              )}
              {isEdit ? "저장" : "추가"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

const INPUT =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-black placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-korean text-xs font-medium uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}
