"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { WHISKY_DETAILS } from "@/lib/whisky-details";
import { cn } from "@/lib/utils";
import type { Menu } from "@/types/database";

// 모든 태그 수집
const ALL_TAGS = Array.from(
  new Set(Object.values(WHISKY_DETAILS).flatMap((d) => d.tags))
).sort();

export default function DetailPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/menus")
      .then((r) => r.json())
      .then((data: Menu[]) => {
        setMenus(data ?? []);
        setLoading(false);
      });
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedTags(new Set());
    setQuery("");
  };

  // 디테일 있는 메뉴만, 필터 적용
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menus.filter((m) => {
      const detail = WHISKY_DETAILS[m.name];
      if (!detail) return false;
      if (q && !m.name.toLowerCase().includes(q) && !(m.name_ko ?? "").toLowerCase().includes(q)) return false;
      if (selectedTags.size === 0) return true;
      return detail.tags.some((t) => selectedTags.has(t));
    });
  }, [menus, selectedTags, query]);

  const hasFilter = selectedTags.size > 0 || query.trim().length > 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-5 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:text-black active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-black">위스키 디테일</h1>
              <p className="font-korean text-xs text-zinc-500">
                {loading ? "불러오는 중..." : `${filtered.length}개 표시 / 전체 ${Object.keys(WHISKY_DETAILS).length}개`}
              </p>
            </div>
            <SlidersHorizontal className="h-5 w-5 text-zinc-400" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 px-5 py-5">
        {/* 검색 */}
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름으로 검색"
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 font-korean text-sm text-black placeholder:text-zinc-400 focus:border-black focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* 태그 필터 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-korean text-xs font-semibold uppercase tracking-widest text-zinc-400">
              손님 유형 필터
            </p>
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="font-korean text-xs text-zinc-400 hover:text-red-500"
              >
                초기화
              </button>
            )}
          </div>
          <div className="-mx-5 overflow-x-auto px-5 pb-2 luxe-scroll">
            <div className="flex w-max flex-wrap gap-2" style={{ maxWidth: "calc(100vw - 40px)" }}>
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 font-korean text-xs font-semibold transition-all active:scale-95",
                    selectedTags.has(tag)
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-zinc-200" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((m) => {
              const detail = WHISKY_DETAILS[m.name]!;
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                >
                  {/* 이름 */}
                  <div className="border-b border-zinc-100 px-5 py-4">
                    <p className="font-display text-lg font-bold text-black">{m.name}</p>
                    {m.name_ko && (
                      <p className="mt-0.5 font-korean text-sm text-zinc-500">{m.name_ko}</p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-korean text-[10px] font-bold",
                          m.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        )}
                      >
                        {m.is_active ? "판매중" : "품절"}
                      </span>
                      {m.is_recommended && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-korean text-[10px] font-bold text-amber-700">
                          위클리 이벤트
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* 설명 */}
                    <p className="font-korean text-sm leading-relaxed text-zinc-700">
                      {detail.desc}
                    </p>

                    {/* 이런 손님에게 */}
                    <div>
                      <p className="mb-2 font-korean text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                        이런 손님에게 좋아요
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.tags.map((t) => (
                          <button
                            key={t}
                            onClick={() => toggleTag(t)}
                            className={cn(
                              "rounded-full border px-2.5 py-1 font-korean text-xs transition-all active:scale-95",
                              selectedTags.has(t)
                                ? "border-black bg-black text-white"
                                : "border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-500"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 유사 위스키 */}
                    <div>
                      <p className="mb-2 font-korean text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                        유사 위스키
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.similar.map((s) => (
                          <span
                            key={s}
                            className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-korean text-xs text-zinc-500"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <p className="font-korean text-sm text-zinc-400">
                  {hasFilter ? "필터에 맞는 위스키가 없습니다." : "디테일 데이터가 없습니다."}
                </p>
                {hasFilter && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 font-korean text-sm font-semibold text-black underline underline-offset-2"
                  >
                    필터 초기화
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
