"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Loader2,
  Search,
  Trash2,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Users,
  Calculator,
  Receipt,
  Save,
  AlertTriangle,
  Cloud,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, formatKRW } from "@/lib/utils";
import type {
  BarTable,
  Category,
  Menu,
  Order,
  OrderItem,
  TableGroup,
} from "@/types/database";

interface Props {
  table: BarTable;
  allTables: BarTable[];
  groups: TableGroup[];
  menus: Menu[];
  categories: Category[];
  onClose: () => void;
  /** 다른 컴포넌트에 테이블 상태 변경 알리기 (예: AVAILABLE → OCCUPIED) */
  onTableUpdated?: (t: BarTable) => void;
}

/**
 * OrderDrawer — POS의 핵심.
 * 1) 테이블 OPEN 주문을 조회/생성
 * 2) 메뉴 검색·카테고리 필터로 빠르게 담기
 * 3) 수량 +/- · 삭제
 * 4) 그룹 총액 (group_id 공유 테이블 합산)
 * 5) 다른 테이블과 합산 계산 (체크박스 다중 선택)
 * 6) 결제 완료 (status='CLOSED' + 테이블 status='AVAILABLE'로 리셋)
 */
export function OrderDrawer({
  table,
  allTables,
  groups,
  menus,
  categories,
  onClose,
  onTableUpdated,
}: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 모든 OPEN 주문 (그룹/합산 총액 계산용)
  const [openOrdersByTable, setOpenOrdersByTable] = useState<Map<string, Order>>(
    new Map(),
  );

  // 메뉴 검색/필터
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [pickerExpanded, setPickerExpanded] = useState(true);

  // 다른 테이블과 합산 — 선택된 추가 테이블 IDs
  const [combineIds, setCombineIds] = useState<Set<string>>(new Set());
  const [combineExpanded, setCombineExpanded] = useState(false);

  // 결제 확인
  const [confirmClose, setConfirmClose] = useState(false);

  // =========================================================
  // 초기 로드 — 현재 테이블의 OPEN 주문 + 전체 OPEN 주문
  // =========================================================
  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseBrowserClient();
      setLoading(true);

      // 전체 OPEN 주문 조회
      const { data: opens } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "OPEN");
      const map = new Map<string, Order>();
      (opens ?? []).forEach((o) => {
        if (o.table_id) map.set(o.table_id, o as Order);
      });
      setOpenOrdersByTable(map);

      // 현재 테이블 주문 — 없으면 새로 생성
      let current = map.get(table.id);
      if (!current) {
        const { data: created } = await supabase
          .from("orders")
          .insert({
            table_id: table.id,
            items: [],
            total_price: 0,
            status: "OPEN",
          })
          .select()
          .single();
        if (created) current = created as Order;
      }
      setOrder(current ?? null);
      setLoading(false);
    };
    load();
  }, [table.id]);

  // =========================================================
  // 주문 저장 (items + total)
  // =========================================================
  const persistOrder = async (next: OrderItem[]) => {
    if (!order) return;
    setSaving(true);
    const total = next.reduce((sum, i) => sum + i.price * i.quantity, 0);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("orders")
        .update({ items: next, total_price: total })
        .eq("id", order.id)
        .select()
        .single();
      if (!error && data) {
        const updated = data as Order;
        setOrder(updated);
        setOpenOrdersByTable((prev) => {
          const m = new Map(prev);
          if (updated.table_id) m.set(updated.table_id, updated);
          return m;
        });

        // 첫 주문 시: 테이블 상태도 OCCUPIED로 자동 변경
        if (next.length > 0 && table.status === "AVAILABLE") {
          const { data: t } = await supabase
            .from("tables")
            .update({ status: "OCCUPIED" })
            .eq("id", table.id)
            .select()
            .single();
          if (t && onTableUpdated) onTableUpdated(t as BarTable);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // 아이템 조작
  // =========================================================
  const addItem = (menu: Menu) => {
    if (!order) return;
    const existing = order.items.find((i) => i.menu_id === menu.id);
    const next: OrderItem[] = existing
      ? order.items.map((i) =>
          i.menu_id === menu.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      : [
          ...order.items,
          {
            menu_id: menu.id,
            name: menu.name_ko ?? menu.name,
            price: menu.price,
            quantity: 1,
          },
        ];
    persistOrder(next);
  };

  const changeQty = (menuId: string, delta: number) => {
    if (!order) return;
    const next = order.items
      .map((i) =>
        i.menu_id === menuId ? { ...i, quantity: i.quantity + delta } : i,
      )
      .filter((i) => i.quantity > 0);
    persistOrder(next);
  };

  const removeItem = (menuId: string) => {
    if (!order) return;
    persistOrder(order.items.filter((i) => i.menu_id !== menuId));
  };

  // =========================================================
  // 결제 완료 (주문 닫기 + 테이블 AVAILABLE)
  // =========================================================
  const closeOrder = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("orders")
        .update({ status: "CLOSED" })
        .eq("id", order.id);
      const { data: t } = await supabase
        .from("tables")
        .update({ status: "AVAILABLE" })
        .eq("id", table.id)
        .select()
        .single();
      if (t && onTableUpdated) onTableUpdated(t as BarTable);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // 그룹 총액 / 합산 총액
  // =========================================================
  const myGroup = useMemo(
    () => (table.group_id ? groups.find((g) => g.id === table.group_id) : null),
    [table.group_id, groups],
  );

  const groupTotal = useMemo(() => {
    if (!myGroup) return 0;
    return allTables
      .filter((t) => t.group_id === myGroup.id)
      .reduce((sum, t) => sum + (openOrdersByTable.get(t.id)?.total_price ?? 0), 0);
  }, [myGroup, allTables, openOrdersByTable]);

  const combineTotal = useMemo(() => {
    let sum = order?.total_price ?? 0;
    combineIds.forEach((id) => {
      sum += openOrdersByTable.get(id)?.total_price ?? 0;
    });
    return sum;
  }, [order, combineIds, openOrdersByTable]);

  // 다른 테이블 선택 (자기 자신, 같은 그룹은 자동 포함되므로 제외)
  const otherTables = useMemo(
    () =>
      allTables
        .filter((t) => t.id !== table.id)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [allTables, table.id],
  );

  // =========================================================
  // 메뉴 검색 + 필터
  // =========================================================
  const filteredMenus = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menus
      .filter((m) => m.is_active)
      .filter((m) => {
        if (catFilter !== "all" && m.category_id !== catFilter) return false;
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          (m.name_ko ?? "").toLowerCase().includes(q)
        );
      })
      .slice(0, 50); // 픽커에서는 최대 50개만
  }, [menus, search, catFilter]);

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col border-l border-gold/25 bg-charcoal-200/97 backdrop-blur-luxe"
      >
        {/* Header */}
        <header className="border-b border-gold/15 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-gold" strokeWidth={1.6} />
              <div>
                <p className="font-display text-xs uppercase tracking-widest2 text-gold">
                  Table · Order
                </p>
                <h2 className="font-display text-2xl font-bold text-ivory">
                  {table.label}
                  {myGroup && (
                    <span
                      className="ml-2 inline-block rounded-full px-2 py-0.5 align-middle font-korean text-[11px] font-bold"
                      style={{ background: myGroup.color, color: "#0A0A0B" }}
                    >
                      {myGroup.name}
                    </span>
                  )}
                </h2>
                <p className="mt-0.5 font-korean text-xs text-ivory/50">
                  <Users className="mr-1 inline h-3 w-3" strokeWidth={1.8} />
                  {table.capacity}석 · {STATUS_LABEL[table.status]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-ivory/60 transition-colors hover:bg-charcoal-100 hover:text-gold"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 자동 저장 인디케이터 */}
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/5 px-3 py-2">
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" strokeWidth={1.8} />
                <span className="font-korean text-[12px] text-emerald-300/90">
                  저장 중…
                </span>
              </>
            ) : (
              <>
                <Cloud className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.8} />
                <span className="font-korean text-[12px] text-emerald-300/90">
                  주문 자동 저장됨 — 닫아도 모든 메뉴가 테이블에 남아 있습니다.
                </span>
              </>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gold" strokeWidth={1.5} />
          </div>
        ) : (
          <>
            {/* Items */}
            <section className="flex-1 overflow-y-auto luxe-scroll">
              {/* 현재 주문 */}
              <div className="border-b border-gold/10 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-korean text-xs font-semibold uppercase tracking-widest2 text-gold/80">
                    이 테이블의 누적 주문
                  </h3>
                  {order && order.items.length > 0 && (
                    <span className="font-korean text-[11px] text-ivory/45">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}잔/접시
                    </span>
                  )}
                </div>
                {order && order.items.length === 0 ? (
                  <p className="py-6 text-center font-korean text-sm italic text-ivory/40">
                    아직 담긴 메뉴가 없습니다.<br />
                    <span className="text-xs">아래 [메뉴 추가]에서 담아주세요.</span>
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {order?.items.map((item) => (
                      <motion.li
                        layout
                        key={item.menu_id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 rounded-xl border border-gold/10 bg-charcoal-100/40 px-3 py-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-korean text-sm font-medium text-ivory">
                            {item.name}
                          </p>
                          <p className="font-korean text-[11px] text-gold/80 tabular-nums">
                            ₩{formatKRW(item.price)} × {item.quantity} = ₩
                            {formatKRW(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => changeQty(item.menu_id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/15 active:scale-95"
                            aria-label="감소"
                          >
                            <Minus className="h-3 w-3" strokeWidth={2} />
                          </button>
                          <span className="w-5 text-center font-korean text-sm tabular-nums text-ivory">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => changeQty(item.menu_id, +1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/15 active:scale-95"
                            aria-label="증가"
                          >
                            <Plus className="h-3 w-3" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => removeItem(item.menu_id)}
                            className="ml-1 rounded-full p-1.5 text-ivory/40 hover:text-burgundy"
                            aria-label="삭제"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 메뉴 픽커 */}
              <div className="px-5 py-4">
                <button
                  onClick={() => setPickerExpanded((v) => !v)}
                  className="mb-3 flex w-full items-center justify-between"
                >
                  <span className="font-korean text-xs font-semibold uppercase tracking-widest2 text-gold/80">
                    메뉴 추가
                  </span>
                  {pickerExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gold/60" strokeWidth={1.6} />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gold/60" strokeWidth={1.6} />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {pickerExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3">
                        {/* 검색 */}
                        <div className="relative">
                          <Search
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60"
                            strokeWidth={1.5}
                          />
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="메뉴 검색 (영문/한글)"
                            className="w-full rounded-full border border-gold/20 bg-charcoal-100/50 py-2 pl-9 pr-9 font-korean text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
                          />
                          {search && (
                            <button
                              onClick={() => setSearch("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ivory/50 hover:text-gold"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* 카테고리 칩 */}
                        <div className="flex flex-wrap gap-1.5">
                          <CatChip
                            active={catFilter === "all"}
                            onClick={() => setCatFilter("all")}
                          >
                            전체
                          </CatChip>
                          {categories.map((c) => (
                            <CatChip
                              key={c.id}
                              active={catFilter === c.id}
                              onClick={() => setCatFilter(c.id)}
                            >
                              {c.name}
                            </CatChip>
                          ))}
                        </div>

                        {/* 메뉴 목록 */}
                        <div className="max-h-72 overflow-y-auto rounded-xl border border-gold/10 luxe-scroll">
                          {filteredMenus.length === 0 ? (
                            <p className="py-6 text-center font-korean text-xs italic text-ivory/40">
                              조건에 맞는 메뉴가 없습니다.
                            </p>
                          ) : (
                            <ul className="divide-y divide-gold/5">
                              {filteredMenus.map((m) => (
                                <li
                                  key={m.id}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gold/5"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate font-display text-sm font-semibold text-ivory">
                                      {m.name}
                                    </p>
                                    {m.name_ko && (
                                      <p className="truncate font-korean text-xs text-ivory/60">
                                        {m.name_ko}
                                      </p>
                                    )}
                                  </div>
                                  <p className="shrink-0 font-korean text-sm tabular-nums text-gold">
                                    ₩{formatKRW(m.price)}
                                  </p>
                                  <button
                                    onClick={() => addItem(m)}
                                    disabled={saving}
                                    className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold hover:bg-gold hover:text-charcoal-900 active:scale-95"
                                    aria-label={`${m.name} 추가`}
                                  >
                                    <Plus className="h-4 w-4" strokeWidth={2.2} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 다른 테이블과 합산 */}
              <div className="border-t border-gold/10 px-5 py-4">
                <button
                  onClick={() => setCombineExpanded((v) => !v)}
                  className="flex w-full items-center justify-between"
                >
                  <span className="font-korean text-xs font-semibold uppercase tracking-widest2 text-gold/80">
                    <Calculator className="mr-1.5 inline h-3.5 w-3.5" strokeWidth={1.6} />
                    다른 테이블과 합산
                  </span>
                  {combineExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gold/60" strokeWidth={1.6} />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gold/60" strokeWidth={1.6} />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {combineExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 font-korean text-[11px] text-ivory/55">
                        합산할 테이블을 선택하세요. 이 테이블 + 선택된 테이블의 주문 금액이 더해져 표시됩니다.
                      </p>
                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {otherTables.map((t) => {
                          const o = openOrdersByTable.get(t.id);
                          const subtotal = o?.total_price ?? 0;
                          const checked = combineIds.has(t.id);
                          return (
                            <button
                              key={t.id}
                              onClick={() =>
                                setCombineIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(t.id)) next.delete(t.id);
                                  else next.add(t.id);
                                  return next;
                                })
                              }
                              className={cn(
                                "flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-1.5 text-left transition-all",
                                checked
                                  ? "border-gold bg-gold/15 text-gold"
                                  : subtotal > 0
                                    ? "border-cognac/30 bg-cognac/5 text-ivory/85"
                                    : "border-gold/10 bg-charcoal-100/30 text-ivory/55 hover:border-gold/30",
                              )}
                            >
                              <span className="font-display text-sm font-semibold">
                                {t.label}
                              </span>
                              <span className="font-korean text-[10px] tabular-nums opacity-80">
                                ₩{formatKRW(subtotal)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Totals & Actions */}
            <footer className="space-y-3 border-t border-gold/15 bg-charcoal-300/60 px-5 py-4">
              <div className="space-y-1.5">
                <TotalRow
                  label="이 테이블"
                  value={order?.total_price ?? 0}
                />
                {myGroup && (
                  <TotalRow
                    label={`그룹 (${myGroup.name})`}
                    value={groupTotal}
                    tone="group"
                  />
                )}
                {combineIds.size > 0 && (
                  <TotalRow
                    label={`합산 (${combineIds.size + 1}개 테이블)`}
                    value={combineTotal}
                    tone="highlight"
                  />
                )}
                <div className="flex items-center justify-between border-t border-gold/15 pt-2">
                  <span className="font-korean text-sm font-semibold text-ivory">
                    {combineIds.size > 0 ? "합산 금액" : "현재 합계"}
                  </span>
                  <span className="font-display text-2xl font-bold text-gold tabular-nums">
                    ₩{formatKRW(combineIds.size > 0 ? combineTotal : order?.total_price ?? 0)}
                  </span>
                </div>
              </div>

              {/* 1차 액션 — 닫기 (주문 유지) */}
              <button
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-korean text-sm font-semibold text-charcoal-900 shadow-gold-glow active:scale-[0.98]"
              >
                <Save className="h-4 w-4" strokeWidth={2} />
                저장하고 닫기 · 주문 유지
              </button>

              {/* 2차 액션 — 결제 종료 (영구 마감) */}
              {!confirmClose ? (
                <button
                  onClick={() => setConfirmClose(true)}
                  disabled={!order || order.items.length === 0 || saving}
                  className={cn(
                    "w-full rounded-full border px-4 py-2 font-korean text-xs font-medium transition-all",
                    !order || order.items.length === 0
                      ? "border-gold/10 text-ivory/30"
                      : "border-cognac/30 text-cognac/85 hover:border-cognac hover:bg-cognac/10",
                  )}
                >
                  <CreditCard className="mr-1 inline h-3.5 w-3.5" strokeWidth={1.8} />
                  주문 마감 · 결제 처리
                </button>
              ) : (
                <div className="rounded-xl border border-cognac/40 bg-cognac/10 p-3">
                  <p className="mb-2 flex items-start gap-2 font-korean text-xs text-ivory/90">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-cognac"
                      strokeWidth={1.8}
                    />
                    <span>
                      주문을 마감하시겠습니까? <br />
                      테이블이 <b className="text-emerald-300">빈자리</b>로
                      돌아가고, 이 주문 기록은 더 이상 누적되지 않습니다.
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmClose(false)}
                      className="flex-1 rounded-full border border-gold/25 px-4 py-2 font-korean text-xs font-medium text-ivory/85 hover:border-gold/60"
                    >
                      취소
                    </button>
                    <button
                      onClick={closeOrder}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-cognac px-4 py-2 font-korean text-xs font-semibold text-charcoal-900 active:scale-95"
                    >
                      {saving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      마감 확정
                    </button>
                  </div>
                </div>
              )}
            </footer>
          </>
        )}
      </motion.aside>
    </>
  );
}

// =========================================================
// Helpers
// =========================================================
const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "빈자리",
  OCCUPIED: "사용중",
  RESERVED: "예약",
  CLOSED: "닫힘",
};

function CatChip({
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
        "shrink-0 rounded-full border px-2.5 py-1 font-korean text-[11px] font-medium transition-all",
        active
          ? "border-gold bg-gold text-charcoal-900"
          : "border-gold/15 bg-charcoal-100/30 text-ivory/65 hover:border-gold/40 hover:text-gold",
      )}
    >
      {children}
    </button>
  );
}

function TotalRow({
  label,
  value,
  tone = "normal",
}: {
  label: string;
  value: number;
  tone?: "normal" | "group" | "highlight";
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={cn(
          "font-korean text-xs",
          tone === "highlight" ? "text-gold" : "text-ivory/60",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-display text-base tabular-nums",
          tone === "highlight"
            ? "font-bold text-gold"
            : tone === "group"
              ? "font-semibold text-cognac"
              : "text-ivory/90",
        )}
      >
        ₩{formatKRW(value)}
      </span>
    </div>
  );
}
