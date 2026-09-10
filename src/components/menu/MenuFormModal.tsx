"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Loader2,
  Save,
  Sparkles,
  Plus,
  Camera,
  Link2,
  Trash2,
  ImageOff,
  Check,
} from "lucide-react";
import {
  adminCreateMenu,
  adminDeleteMenu,
  adminUpdateMenu,
  adminUploadImage,
} from "@/lib/admin-api";
import { groupOf } from "@/lib/category-groups";
import { cn, parseIntegerInput } from "@/lib/utils";
import type { Category, Menu } from "@/types/database";

interface Props {
  categories: Category[];
  /** 있으면 수정 모드, 없으면 생성 모드 */
  menu?: Menu;
  /** 모달을 열 때 미리 선택해 둘 카테고리 (칵테일 탭에서 추가할 때 등) */
  defaultCategoryId?: string;
  onClose: () => void;
  onSaved: (m: Menu) => void;
  onDeleted?: (id: string) => void;
}

/**
 * MenuFormModal — 메뉴 생성 / 수정 통합 모달.
 * iPad 라이트 테마, 큰 터치 타깃.
 *
 * 카테고리가 속한 그룹에 따라 입력란이 달라집니다.
 *   · 위스키       : 병 가격 · 원산지 · 위클리 이벤트
 *   · 칵테일 / 푸드 : 사진을 맨 위에, 도수를 가격 옆에, 병 가격은 숨김
 */
export function MenuFormModal({
  categories,
  menu,
  defaultCategoryId,
  onClose,
  onSaved,
  onDeleted,
}: Props) {
  const isEdit = !!menu;

  const [form, setForm] = useState({
    category_id: menu?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? "",
    name: menu?.name ?? "",
    name_ko: menu?.name_ko ?? "",
    price: menu ? String(menu.price) : "",
    bottle_price: menu?.bottle_price != null ? String(menu.bottle_price) : "",
    description: menu?.description ?? "",
    abv: menu?.abv != null ? String(menu.abv) : "",
    origin: menu?.origin ?? "",
    image_url: menu?.image_url ?? "",
    is_active: menu?.is_active ?? true,
    is_recommended: menu?.is_recommended ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const categoryName = useMemo(
    () => categories.find((c) => c.id === form.category_id)?.name ?? "",
    [categories, form.category_id],
  );
  const isWhisky = groupOf(categoryName) === "whisky";
  const showsPhotoFirst = !isWhisky;

  // ── 사진 ────────────────────────────────────────────────
  const pickFile = () => fileRef.current?.click();

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일을 다시 고를 수 있게 초기화
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      update("image_url", await adminUploadImage(file));
    } catch (err: any) {
      setError(err?.message ?? "사진을 올리지 못했습니다.");
      setUrlMode(true);
    } finally {
      setUploading(false);
    }
  };

  // ── 저장 ────────────────────────────────────────────────
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.category_id) return setError("카테고리를 선택해주세요.");
    if (!form.name.trim()) return setError("이름을 입력해주세요.");

    const priceNum = parseIntegerInput(form.price);
    if (priceNum == null || priceNum < 0) {
      return setError("가격을 올바르게 입력해주세요.");
    }

    const bottleNum =
      isWhisky && form.bottle_price.trim()
        ? parseIntegerInput(form.bottle_price)
        : null;

    let abvNum: number | null = null;
    if (form.abv.trim()) {
      const parsed = Number(form.abv);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
        return setError("도수는 0에서 100 사이 숫자로 입력해주세요.");
      }
      abvNum = parsed;
    }

    setSaving(true);
    try {
      const payload = {
        category_id: form.category_id,
        name: form.name.trim(),
        name_ko: form.name_ko.trim() || null,
        price: priceNum,
        bottle_price: bottleNum,
        description: form.description.trim() || null,
        abv: abvNum,
        origin: form.origin.trim() || null,
        image_url: form.image_url.trim() || null,
        is_active: form.is_active,
        is_recommended: form.is_recommended,
      };

      const saved = isEdit
        ? await adminUpdateMenu(menu!.id, payload)
        : await adminCreateMenu(payload as any);

      onSaved(saved);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!menu) return;
    setSaving(true);
    try {
      await adminDeleteMenu(menu.id);
      onDeleted?.(menu.id);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "삭제에 실패했습니다.");
      setSaving(false);
      setConfirmingDelete(false);
    }
  };

  // ── 사진 블록 ───────────────────────────────────────────
  const photoBlock = (
    <Field label={showsPhotoFirst ? "사진" : "사진 (선택)"}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFilePicked}
        className="hidden"
      />

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={pickFile}
          disabled={uploading}
          className={cn(
            "relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed transition-all active:scale-95",
            form.image_url
              ? "border-transparent"
              : "border-zinc-300 bg-zinc-50 hover:border-black",
          )}
          aria-label="사진 선택"
        >
          {form.image_url ? (
            // 임의 호스트 주소도 미리보기 가능하도록 next/image 대신 img 사용
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.image_url}
              alt="메뉴 사진 미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-zinc-400">
              <Camera className="h-6 w-6" strokeWidth={1.6} />
              <span className="font-korean text-[11px]">사진 추가</span>
            </span>
          )}

          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <button
            type="button"
            onClick={pickFile}
            disabled={uploading}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 font-korean text-sm font-semibold text-zinc-700 active:scale-[0.98] disabled:opacity-60"
          >
            <Camera className="h-4 w-4" strokeWidth={1.8} />
            {form.image_url ? "사진 바꾸기" : "사진 올리기"}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUrlMode((v) => !v)}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 px-3 font-korean text-xs font-medium text-zinc-500 active:scale-[0.98]"
            >
              <Link2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              주소 입력
            </button>
            {form.image_url && (
              <button
                type="button"
                onClick={() => update("image_url", "")}
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 px-3 font-korean text-xs font-medium text-zinc-500 active:scale-[0.98]"
              >
                <ImageOff className="h-3.5 w-3.5" strokeWidth={1.8} />
                사진 빼기
              </button>
            )}
          </div>
        </div>
      </div>

      {urlMode && (
        <input
          value={form.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="https://…"
          className={cn(INPUT, "mt-2 font-korean text-sm")}
        />
      )}
    </Field>
  );

  const abvField = (
    <Field label="도수 (%, 선택)">
      <input
        inputMode="decimal"
        value={form.abv}
        onChange={(e) => update("abv", e.target.value.replace(/[^0-9.]/g, ""))}
        placeholder={isWhisky ? "46" : "15"}
        className={cn(INPUT, "font-korean tabular-nums")}
      />
    </Field>
  );

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
          {showsPhotoFirst && photoBlock}

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
            <Field label={isWhisky ? "영문 이름 *" : "이름 *"}>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={isWhisky ? "Macallan 25y" : "커피앤시가렛"}
                className={cn(INPUT, "font-display text-lg font-semibold")}
              />
            </Field>
            <Field label="한글 이름">
              <input
                value={form.name_ko}
                onChange={(e) => update("name_ko", e.target.value)}
                placeholder={isWhisky ? "맥켈란 25년" : "(같으면 비워두세요)"}
                className={cn(INPUT, "font-korean")}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label={isWhisky ? "잔 가격 (원) *" : "가격 (원) *"}>
              <input
                required
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.price}
                onChange={(e) =>
                  update("price", e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="16000"
                className={cn(INPUT, "font-korean tabular-nums")}
              />
            </Field>

            {isWhisky ? (
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
            ) : (
              abvField
            )}
          </div>

          <Field label={isWhisky ? "설명 (선택)" : "설명 · 베이스 (선택)"}>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder={
                isWhisky ? "짧은 설명…" : "Hazelnut, Lime etc. / 논알콜 +3,000원"
              }
              className={cn(INPUT, "resize-y font-korean leading-relaxed")}
            />
          </Field>

          {isWhisky && (
            <div className="grid gap-4 md:grid-cols-2">
              {abvField}
              <Field label="원산지 (선택)">
                <input
                  value={form.origin}
                  onChange={(e) => update("origin", e.target.value)}
                  placeholder="Islay"
                  className={cn(INPUT, "font-korean")}
                />
              </Field>
            </div>
          )}

          {!showsPhotoFirst && photoBlock}

          {/* 품절 스위치 */}
          <button
            type="button"
            onClick={() => update("is_active", !form.is_active)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors active:scale-[0.99]",
              form.is_active
                ? "border-zinc-200 bg-zinc-50"
                : "border-red-200 bg-red-50",
            )}
          >
            <span
              className={cn(
                "font-korean text-sm font-medium",
                form.is_active ? "text-zinc-700" : "text-red-700",
              )}
            >
              {form.is_active ? "판매 중" : "품절 — 메뉴판에 품절로 표시"}
            </span>
            <span
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                form.is_active ? "bg-black" : "bg-red-400",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full bg-white transition-all",
                  form.is_active ? "left-6" : "left-1",
                )}
              />
            </span>
          </button>

          {isWhisky && (
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
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 font-korean text-sm text-red-800">
              {error}
            </p>
          )}

          {confirmingDelete ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="font-korean text-sm text-red-800">
                정말 삭제하시겠습니까? 되돌릴 수 없습니다.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-korean text-sm font-medium text-zinc-700 active:scale-[0.98]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={doDelete}
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-3 font-korean text-sm font-semibold text-white active:scale-[0.98] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" strokeWidth={2.4} />
                  )}
                  삭제 확정
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 pt-4">
              {isEdit && onDeleted && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="mr-auto inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-3 font-korean text-sm font-semibold text-red-700 active:scale-95"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                  삭제
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-zinc-300 px-5 py-3 font-korean text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
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
          )}
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
