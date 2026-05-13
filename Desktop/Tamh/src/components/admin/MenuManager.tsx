"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Loader2,
  Save,
  X,
  Star,
  StarOff,
  Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatKRW, cn } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";

interface Props {
  initialCategories: Category[];
  initialMenus: Menu[];
}

export function MenuManager({ initialCategories, initialMenus }: Props) {
  const [categories] = useState<Category[]>(initialCategories);
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSaved = (m: Menu) => {
    setMenus((prev) => {
      const exists = prev.find((p) => p.id === m.id);
      return exists ? prev.map((p) => (p.id === m.id ? m : p)) : [m, ...prev];
    });
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (!error) setMenus((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleRecommend = async (m: Menu) => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("menus")
      .update({ is_recommended: !m.is_recommended })
      .eq("id", m.id)
      .select()
      .single();
    if (!error && data) handleSaved(data as Menu);
  };

  const toggleActive = async (m: Menu) => {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("menus")
      .update({ is_active: !m.is_active })
      .eq("id", m.id)
      .select()
      .single();
    if (!error && data) handleSaved(data as Menu);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="display-heading text-3xl">Menu Editor</h2>
          <p className="mt-2 font-serif text-sm text-ivory/60">
            전체 {menus.length}개 · 카테고리 {categories.length}개
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-gold">
          <Plus className="h-4 w-4" />
          New Menu
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto luxe-scroll">
          <table className="w-full text-sm">
            <thead className="border-b border-gold/15 text-left font-serif text-xs uppercase tracking-widest2 text-gold/80">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4 text-right">Glass / Bottle</th>
                <th className="px-5 py-4 text-center">Pick</th>
                <th className="px-5 py-4 text-center">Active</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {menus.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center font-serif italic text-ivory/50"
                  >
                    메뉴가 없습니다. 우측 상단에서 새로 추가해주세요.
                  </td>
                </tr>
              )}
              {menus.map((m) => {
                const cat = categories.find((c) => c.id === m.category_id);
                return (
                  <tr
                    key={m.id}
                    className="text-ivory/85 transition-colors hover:bg-gold/5"
                  >
                    <td className="px-5 py-4">
                      <div className="font-display text-base text-ivory">
                        {m.name}
                      </div>
                      {m.name_ko && (
                        <div className="font-serif text-xs text-ivory/45">
                          {m.name_ko}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-serif text-xs text-ivory/70">
                      {cat?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-right font-serif text-gold">
                      ₩{formatKRW(m.price)}
                      {m.bottle_price && (
                        <span className="text-ivory/40">
                          {" "}
                          / {formatKRW(m.bottle_price)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleRecommend(m)}
                        className="text-gold transition-transform hover:scale-110"
                        aria-label="추천 토글"
                      >
                        {m.is_recommended ? (
                          <Star className="h-4 w-4 fill-current" strokeWidth={1.5} />
                        ) : (
                          <StarOff
                            className="h-4 w-4 text-ivory/30"
                            strokeWidth={1.5}
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleActive(m)}
                        className={cn(
                          "inline-block h-2.5 w-2.5 rounded-full transition-colors",
                          m.is_active
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                            : "bg-ivory/20",
                        )}
                        aria-label="활성 토글"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditing(m)}
                          className="rounded-full p-2 text-ivory/60 transition-colors hover:bg-gold/10 hover:text-gold"
                          aria-label="수정"
                        >
                          <Edit3 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="rounded-full p-2 text-ivory/60 transition-colors hover:bg-burgundy/20 hover:text-burgundy"
                          aria-label="삭제"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {(creating || editing) && (
          <MenuEditor
            menu={editing}
            categories={categories}
            onClose={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// Editor Modal
// =========================================================
function MenuEditor({
  menu,
  categories,
  onClose,
  onSaved,
}: {
  menu: Menu | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (m: Menu) => void;
}) {
  const [form, setForm] = useState({
    name: menu?.name ?? "",
    name_ko: menu?.name_ko ?? "",
    category_id: menu?.category_id ?? categories[0]?.id ?? "",
    description: menu?.description ?? "",
    price: menu?.price ?? 0,
    bottle_price: menu?.bottle_price ?? 0,
    origin: menu?.origin ?? "",
    abv: menu?.abv ?? 0,
    cask_type: menu?.cask_type ?? "",
    image_url: menu?.image_url ?? "",
    is_active: menu?.is_active ?? true,
    is_recommended: menu?.is_recommended ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pending, startTransition] = useTransition();

  const generateWithGemini = async () => {
    if (!form.name) return alert("먼저 메뉴 이름을 입력해주세요.");
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          name_ko: form.name_ko,
          origin: form.origin,
          cask_type: form.cask_type,
          abv: form.abv,
        }),
      });
      const json = await res.json();
      if (json.description) {
        setForm((f) => ({ ...f, description: json.description }));
      } else {
        alert(json.error || "생성에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("Gemini 호출 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const payload = {
        ...form,
        bottle_price: form.bottle_price || null,
        abv: form.abv || null,
      };

      let result;
      if (menu) {
        result = await supabase
          .from("menus")
          .update(payload)
          .eq("id", menu.id)
          .select()
          .single();
      } else {
        result = await supabase.from("menus").insert(payload).select().single();
      }

      if (result.error) throw result.error;
      onSaved(result.data as Menu);
    } catch (e: any) {
      console.error(e);
      alert(`저장 실패: ${e.message ?? "알 수 없는 오류"}`);
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
        className="fixed inset-x-4 top-12 z-50 mx-auto max-h-[88vh] max-w-2xl overflow-y-auto rounded-2xl border border-gold/25 bg-charcoal-200/95 p-8 backdrop-blur-luxe luxe-scroll"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="display-heading text-2xl">
            {menu ? "Edit Menu" : "New Menu"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ivory/60 hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name (영문)">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={INPUT}
                placeholder="Macallan 18y"
              />
            </Field>
            <Field label="Name (한글)">
              <input
                value={form.name_ko ?? ""}
                onChange={(e) => setForm({ ...form, name_ko: e.target.value })}
                className={INPUT}
                placeholder="맥켈란 18년"
              />
            </Field>
          </div>

          <Field label="Category">
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className={INPUT}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Description"
            action={
              <button
                type="button"
                onClick={generateWithGemini}
                disabled={generating}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[10px] uppercase tracking-widest2 text-gold transition-colors hover:bg-gold hover:text-charcoal-900 disabled:opacity-50"
              >
                {generating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Wand2 className="h-3 w-3" strokeWidth={1.8} />
                )}
                Gemini로 생성
              </button>
            }
          >
            <textarea
              rows={5}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={cn(INPUT, "resize-y leading-relaxed")}
              placeholder="우아한 문체로 설명하거나 Gemini로 자동 생성하세요."
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Glass Price (KRW)">
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className={INPUT}
              />
            </Field>
            <Field label="Bottle Price (KRW · optional)">
              <input
                type="number"
                min={0}
                value={form.bottle_price ?? 0}
                onChange={(e) =>
                  setForm({ ...form, bottle_price: Number(e.target.value) })
                }
                className={INPUT}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Origin">
              <input
                value={form.origin ?? ""}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className={INPUT}
                placeholder="Speyside"
              />
            </Field>
            <Field label="ABV (%)">
              <input
                type="number"
                step="0.1"
                value={form.abv ?? 0}
                onChange={(e) =>
                  setForm({ ...form, abv: Number(e.target.value) })
                }
                className={INPUT}
              />
            </Field>
            <Field label="Cask Type">
              <input
                value={form.cask_type ?? ""}
                onChange={(e) =>
                  setForm({ ...form, cask_type: e.target.value })
                }
                className={INPUT}
                placeholder="Sherry Cask"
              />
            </Field>
          </div>

          <Field label="Image URL (Supabase Storage)">
            <input
              value={form.image_url ?? ""}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className={INPUT}
              placeholder="https://....supabase.co/storage/v1/.../macallan.jpg"
            />
          </Field>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-ivory/80">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
                className="h-4 w-4 accent-gold"
              />
              Active
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-ivory/80">
              <input
                type="checkbox"
                checked={form.is_recommended}
                onChange={(e) =>
                  setForm({ ...form, is_recommended: e.target.checked })
                }
                className="h-4 w-4 accent-gold"
              />
              <Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
              Recommended (Signature)
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-gold/15 pt-5">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-gold">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" strokeWidth={1.8} />
              )}
              {menu ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

const INPUT =
  "w-full rounded-lg border border-gold/20 bg-charcoal-100/50 px-4 py-2.5 font-serif text-base text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-serif text-xs uppercase tracking-widest2 text-gold/80">
          {label}
        </span>
        {action}
      </div>
      {children}
    </label>
  );
}
