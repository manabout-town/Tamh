"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Save,
  Link2,
  Unlink,
  Square,
  Circle,
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
  Coffee,
  Lock,
  Move,
  Check,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn, formatKRW } from "@/lib/utils";
import type {
  BarTable,
  Category,
  Menu,
  Order,
  TableGroup,
  TableShape,
  TableStatus,
} from "@/types/database";
import { OrderDrawer } from "./OrderDrawer";

// =============================================================
// Constants
// =============================================================
const CANVAS_W = 1200;
const CANVAS_H = 700;
const GRID = 20;
const MIN_SIZE = 80;
const MAX_SIZE = 400;
const PALETTE = [
  "#D4AF37", "#C2854D", "#5C1F2C", "#7C9C5E", "#5A8DB5", "#A05CD4",
];

const STATUS_META: Record<
  TableStatus,
  { label: string; color: string; icon: LucideIcon }
> = {
  AVAILABLE: { label: "빈자리", color: "text-emerald-400", icon: CheckCircle2 },
  OCCUPIED:  { label: "사용중", color: "text-gold",         icon: Coffee },
  RESERVED:  { label: "예약",   color: "text-cognac",       icon: Lock },
  CLOSED:    { label: "닫힘",   color: "text-burgundy",     icon: XCircle },
};

type Mode = "move" | "combine";

interface Props {
  initialTables: BarTable[];
  initialGroups: TableGroup[];
  menus: Menu[];
  categories: Category[];
}

// =============================================================
// FloorPlan
// =============================================================
export function FloorPlan({
  initialTables,
  initialGroups,
  menus,
  categories,
}: Props) {
  const [tables, setTables] = useState<BarTable[]>(initialTables);
  const [groups, setGroups] = useState<TableGroup[]>(initialGroups);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [savingAll, setSavingAll] = useState(false);
  const [mode, setMode] = useState<Mode>("move");
  const [orderTableId, setOrderTableId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 드래그 (이동)
  const dragRef = useRef<{
    tableIds: string[];
    startX: number;
    startY: number;
    origin: Map<string, { x: number; y: number }>;
    moved: boolean;
  } | null>(null);

  // 리사이즈
  const resizeRef = useRef<{
    tableId: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  // 모드 전환 시 선택 초기화
  useEffect(() => {
    setSelected(new Set());
  }, [mode]);

  // =========================================================
  // Realtime sync
  // =========================================================
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("tables-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tables" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTables((prev) =>
              prev.some((t) => t.id === (payload.new as BarTable).id)
                ? prev
                : [...prev, payload.new as BarTable],
            );
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as BarTable;
            if (dragRef.current?.tableIds.includes(updated.id)) return;
            if (resizeRef.current?.tableId === updated.id) return;
            setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          } else if (payload.eventType === "DELETE") {
            setTables((prev) =>
              prev.filter((t) => t.id !== (payload.old as BarTable).id),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "table_groups" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setGroups((prev) =>
              prev.some((g) => g.id === (payload.new as TableGroup).id)
                ? prev
                : [...prev, payload.new as TableGroup],
            );
          } else if (payload.eventType === "UPDATE") {
            setGroups((prev) =>
              prev.map((g) =>
                g.id === (payload.new as TableGroup).id
                  ? (payload.new as TableGroup)
                  : g,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setGroups((prev) =>
              prev.filter((g) => g.id !== (payload.old as TableGroup).id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // =========================================================
  // Add / Delete / Group / Ungroup / Save
  // =========================================================
  const addTable = useCallback(
    async (shape: TableShape = "rect") => {
      const supabase = getSupabaseBrowserClient();
      const nextNumber = tables.length + 1;
      const offset = (tables.length % 6) * 24;
      const { data, error } = await supabase
        .from("tables")
        .insert({
          label: `T${nextNumber}`,
          x: 80 + offset,
          y: 80 + offset,
          width: 130,
          height: 130,
          shape,
          capacity: 4,
          status: "AVAILABLE",
        })
        .select()
        .single();
      if (!error && data) setTables((prev) => [...prev, data as BarTable]);
    },
    [tables.length],
  );

  const deleteSelected = useCallback(async () => {
    if (selected.size === 0) return;
    if (!confirm(`${selected.size}개의 테이블을 삭제하시겠습니까?`)) return;
    const supabase = getSupabaseBrowserClient();
    const ids = Array.from(selected);
    await supabase.from("tables").delete().in("id", ids);
    setTables((prev) => prev.filter((t) => !selected.has(t.id)));
    setSelected(new Set());
  }, [selected]);

  const groupSelected = useCallback(async () => {
    if (selected.size < 2) {
      alert("2개 이상 선택해야 묶을 수 있습니다.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const color = PALETTE[groups.length % PALETTE.length];
    const { data: g, error: gErr } = await supabase
      .from("table_groups")
      .insert({ name: `Group ${groups.length + 1}`, color })
      .select()
      .single();
    if (gErr || !g) return;
    const ids = Array.from(selected);
    await supabase.from("tables").update({ group_id: g.id }).in("id", ids);
    setGroups((prev) => [...prev, g as TableGroup]);
    setTables((prev) =>
      prev.map((t) => (selected.has(t.id) ? { ...t, group_id: g.id } : t)),
    );
    setSelected(new Set());
    setMode("move");
  }, [selected, groups.length]);

  const ungroupSelected = useCallback(async () => {
    if (selected.size === 0) return;
    const supabase = getSupabaseBrowserClient();
    const ids = Array.from(selected);
    await supabase.from("tables").update({ group_id: null }).in("id", ids);
    setTables((prev) =>
      prev.map((t) => (selected.has(t.id) ? { ...t, group_id: null } : t)),
    );
  }, [selected]);

  const saveAll = useCallback(async () => {
    if (dirty.size === 0) return;
    setSavingAll(true);
    const supabase = getSupabaseBrowserClient();
    const idsToSave = Array.from(dirty);
    try {
      await Promise.all(
        idsToSave.map((id) => {
          const t = tables.find((tt) => tt.id === id);
          if (!t) return Promise.resolve();
          return supabase
            .from("tables")
            .update({ x: t.x, y: t.y, width: t.width, height: t.height })
            .eq("id", id);
        }),
      );
      setDirty(new Set());
    } finally {
      setSavingAll(false);
    }
  }, [dirty, tables]);

  // =========================================================
  // Selection (combine 모드)
  // =========================================================
  const toggleSelection = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // =========================================================
  // 드래그 (이동)
  // =========================================================
  const onPointerDownTable = (e: React.PointerEvent, table: BarTable) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    // 합치기 모드 — 선택 토글, 드래그 비활성
    if (mode === "combine") {
      toggleSelection(table.id);
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    // 이동 모드: 드래그 시작
    const multi = e.shiftKey || e.metaKey || e.ctrlKey;
    let nextSelected: Set<string>;
    if (multi) {
      nextSelected = new Set(selected);
      if (nextSelected.has(table.id)) nextSelected.delete(table.id);
      else nextSelected.add(table.id);
    } else if (!selected.has(table.id)) {
      nextSelected = new Set([table.id]);
    } else {
      nextSelected = new Set(selected);
    }
    setSelected(nextSelected);

    const dragIds = Array.from(nextSelected);
    const origin = new Map(
      dragIds.map((id) => {
        const t = tables.find((tt) => tt.id === id);
        return [id, { x: t?.x ?? 0, y: t?.y ?? 0 }];
      }),
    );
    dragRef.current = {
      tableIds: dragIds,
      startX: e.clientX,
      startY: e.clientY,
      origin,
      moved: false,
    };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // 리사이즈 우선
    const r = resizeRef.current;
    if (r) {
      const dx = e.clientX - r.startX;
      const dy = e.clientY - r.startY;
      const newW = Math.round((r.startW + dx) / GRID) * GRID;
      const newH = Math.round((r.startH + dy) / GRID) * GRID;
      setTables((prev) =>
        prev.map((t) => {
          if (t.id !== r.tableId) return t;
          const w = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newW));
          const h = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newH));
          // 캔버스 경계 안 넘도록
          return {
            ...t,
            width: Math.min(w, CANVAS_W - t.x),
            height: Math.min(h, CANVAS_H - t.y),
          };
        }),
      );
      return;
    }

    const d = dragRef.current;
    if (!d) return;
    if (mode === "combine") return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
    d.moved = true;

    setTables((prev) =>
      prev.map((t) => {
        if (!d.tableIds.includes(t.id)) return t;
        const o = d.origin.get(t.id)!;
        const nx = Math.round((o.x + dx) / GRID) * GRID;
        const ny = Math.round((o.y + dy) / GRID) * GRID;
        return {
          ...t,
          x: Math.max(0, Math.min(CANVAS_W - t.width, nx)),
          y: Math.max(0, Math.min(CANVAS_H - t.height, ny)),
        };
      }),
    );
  };

  const onPointerUp = () => {
    // 리사이즈 종료
    if (resizeRef.current) {
      // setState 콜백이 비동기로 돌기 전에 ID를 캡쳐
      const resizedTableId = resizeRef.current.tableId;
      resizeRef.current = null;
      setDirty((prev) => {
        const next = new Set(prev);
        next.add(resizedTableId);
        return next;
      });
      return;
    }

    const d = dragRef.current;
    if (!d) return;
    if (d.moved) {
      setDirty((prev) => {
        const next = new Set(prev);
        d.tableIds.forEach((id) => next.add(id));
        return next;
      });
    } else {
      // 클릭만 한 경우 — 이동 모드 + 단일 선택 → 주문 드로어 열기
      if (mode === "move" && d.tableIds.length === 1) {
        setOrderTableId(d.tableIds[0]);
      }
    }
    dragRef.current = null;
  };

  // 리사이즈 핸들 pointer down
  const onResizeStart = (e: React.PointerEvent, table: BarTable) => {
    e.stopPropagation();
    resizeRef.current = {
      tableId: table.id,
      startX: e.clientX,
      startY: e.clientY,
      startW: table.width,
      startH: table.height,
    };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current && mode === "move") {
      setSelected(new Set());
    }
  };

  // =========================================================
  // Memos
  // =========================================================
  const groupMap = useMemo(() => {
    const m = new Map<string, TableGroup>();
    groups.forEach((g) => m.set(g.id, g));
    return m;
  }, [groups]);

  const stats = useMemo(() => {
    const c = { AVAILABLE: 0, OCCUPIED: 0, RESERVED: 0, CLOSED: 0 } as Record<
      TableStatus,
      number
    >;
    tables.forEach((t) => c[t.status]++);
    return c;
  }, [tables]);

  const orderTable = orderTableId
    ? tables.find((t) => t.id === orderTableId) ?? null
    : null;

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="space-y-4">
      {/* 모드 + 통계 + 액션 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/15 bg-charcoal-100/50 px-4 py-3 backdrop-blur-luxe">
        {/* Mode switcher */}
        <div className="flex items-center gap-1 rounded-full border border-gold/15 bg-charcoal-200/60 p-1">
          <ModeTab
            active={mode === "move"}
            onClick={() => setMode("move")}
            icon={<Move className="h-4 w-4" strokeWidth={1.6} />}
            label="이동/주문"
          />
          <ModeTab
            active={mode === "combine"}
            onClick={() => setMode("combine")}
            icon={<Link2 className="h-4 w-4" strokeWidth={1.6} />}
            label="합치기"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Stat label="전체"   value={tables.length}   accent />
          <Stat label="빈자리" value={stats.AVAILABLE} dotColor="bg-emerald-400" />
          <Stat label="사용중" value={stats.OCCUPIED}  dotColor="bg-gold" />
          <Stat label="예약"   value={stats.RESERVED}  dotColor="bg-cognac" />
          <Stat label="닫힘"   value={stats.CLOSED}    dotColor="bg-burgundy" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "move" ? (
            <>
              <ToolbarButton
                onClick={() => addTable("rect")}
                icon={<Square className="h-3.5 w-3.5" />}
              >
                사각 추가
              </ToolbarButton>
              <ToolbarButton
                onClick={() => addTable("circle")}
                icon={<Circle className="h-3.5 w-3.5" />}
              >
                원형 추가
              </ToolbarButton>
              <ToolbarButton
                onClick={deleteSelected}
                disabled={selected.size === 0}
                icon={<Trash2 className="h-3.5 w-3.5" />}
                tone="danger"
              >
                삭제
              </ToolbarButton>
              <button
                onClick={saveAll}
                disabled={dirty.size === 0 || savingAll}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-korean text-sm font-medium transition-all",
                  dirty.size > 0
                    ? "border-gold bg-gold text-charcoal-900 hover:shadow-gold-glow"
                    : "border-gold/15 text-ivory/35",
                )}
              >
                {savingAll ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                {dirty.size > 0 ? `저장 (${dirty.size})` : "저장됨"}
              </button>
            </>
          ) : (
            <ToolbarButton
              onClick={ungroupSelected}
              disabled={selected.size === 0}
              icon={<Unlink className="h-3.5 w-3.5" />}
            >
              그룹 해제
            </ToolbarButton>
          )}
        </div>
      </div>

      {/* 모드 안내 배너 */}
      <AnimatePresence>
        {mode === "combine" ? (
          <motion.div
            key="combine"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3 backdrop-blur-luxe"
          >
            <p className="font-korean text-sm text-ivory">
              <Link2 className="mr-2 inline h-4 w-4 text-gold" strokeWidth={1.8} />
              합치고 싶은 테이블을 탭하세요. 2개 이상 선택 시 하단
              <span className="mx-1 font-semibold text-gold">[N개 묶기]</span>
              버튼이 나타납니다.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="move"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-gold/15 bg-charcoal-100/40 px-5 py-3 backdrop-blur-luxe"
          >
            <p className="font-korean text-sm text-ivory/75">
              <Receipt className="mr-2 inline h-4 w-4 text-gold" strokeWidth={1.8} />
              테이블을 <span className="font-semibold text-gold">탭하면</span> 주문 화면 열림 ·{" "}
              <span className="font-semibold text-gold">드래그</span>로 위치 이동 ·{" "}
              <span className="font-semibold text-gold">우하단 모서리</span>를 끌어 크기 조절.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 캔버스 */}
      <div className="relative">
        <div
          className="overflow-auto rounded-2xl border border-gold/20 bg-charcoal-200/60 luxe-scroll"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)",
          }}
        >
          <div
            ref={canvasRef}
            className="relative select-none"
            onMouseDown={onCanvasMouseDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              backgroundImage:
                "linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)",
              backgroundSize: `${GRID}px ${GRID}px`,
              touchAction: "none",
            }}
          >
            {/* 그룹 외곽선 */}
            {Array.from(groupMap.values()).map((g) => {
              const groupTables = tables.filter((t) => t.group_id === g.id);
              if (groupTables.length < 2) return null;
              const xs = groupTables.flatMap((t) => [t.x, t.x + t.width]);
              const ys = groupTables.flatMap((t) => [t.y, t.y + t.height]);
              const minX = Math.min(...xs) - 10;
              const minY = Math.min(...ys) - 10;
              const maxX = Math.max(...xs) + 10;
              const maxY = Math.max(...ys) + 10;
              return (
                <div
                  key={g.id}
                  className="pointer-events-none absolute rounded-2xl border-2 border-dashed"
                  style={{
                    left: minX,
                    top: minY,
                    width: maxX - minX,
                    height: maxY - minY,
                    borderColor: g.color,
                    background: `${g.color}10`,
                  }}
                >
                  <span
                    className="absolute -top-3 left-3 rounded-full px-2 py-0.5 font-korean text-[11px] font-bold"
                    style={{ background: g.color, color: "#0A0A0B" }}
                  >
                    {g.name ?? "Group"}
                  </span>
                </div>
              );
            })}

            {/* Tables */}
            {tables.map((t) => (
              <TableNode
                key={t.id}
                table={t}
                isSelected={selected.has(t.id)}
                isDirty={dirty.has(t.id)}
                mode={mode}
                groupColor={t.group_id ? groupMap.get(t.group_id)?.color : null}
                onPointerDown={(e) => onPointerDownTable(e, t)}
                onResizeStart={(e) => onResizeStart(e, t)}
              />
            ))}
          </div>
        </div>

        {/* 플로팅 N개 묶기 (합치기 모드) */}
        <AnimatePresence>
          {mode === "combine" && selected.size >= 2 && (
            <motion.button
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={groupSelected}
              className="absolute bottom-6 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-7 py-4 font-korean text-base font-semibold text-charcoal-900 shadow-[0_12px_40px_-8px_rgba(212,175,55,0.7)] active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #F6E8A6 0%, #D4AF37 50%, #B8952A 100%)",
              }}
            >
              <Link2 className="h-5 w-5" strokeWidth={2} />
              <span className="text-lg">{selected.size}개 묶기</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 사용법 */}
      <LegendPanel />

      {/* 주문 드로어 */}
      <AnimatePresence>
        {orderTable && (
          <OrderDrawer
            table={orderTable}
            allTables={tables}
            groups={groups}
            menus={menus}
            categories={categories}
            onClose={() => setOrderTableId(null)}
            onTableUpdated={(t) =>
              setTables((prev) => prev.map((p) => (p.id === t.id ? t : p)))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// ModeTab
// =========================================================
function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-korean text-sm font-medium transition-all",
        active
          ? "bg-gold text-charcoal-900 shadow-gold-glow"
          : "text-ivory/65 hover:text-gold",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

// =========================================================
// TableNode — 테이블 (드래그 + 리사이즈 + 클릭)
// =========================================================
function TableNode({
  table,
  isSelected,
  isDirty,
  mode,
  groupColor,
  onPointerDown,
  onResizeStart,
}: {
  table: BarTable;
  isSelected: boolean;
  isDirty: boolean;
  mode: Mode;
  groupColor: string | null | undefined;
  onPointerDown: (e: React.PointerEvent) => void;
  onResizeStart: (e: React.PointerEvent) => void;
}) {
  const StatusIcon = STATUS_META[table.status].icon;
  const statusBg: Record<TableStatus, string> = {
    AVAILABLE: "rgba(52,211,153,0.10)",
    OCCUPIED:  "rgba(212,175,55,0.18)",
    RESERVED:  "rgba(194,133,77,0.18)",
    CLOSED:    "rgba(92,31,44,0.30)",
  };
  const statusBorder: Record<TableStatus, string> = {
    AVAILABLE: "rgba(52,211,153,0.55)",
    OCCUPIED:  "rgba(212,175,55,0.85)",
    RESERVED:  "rgba(194,133,77,0.85)",
    CLOSED:    "rgba(92,31,44,0.85)",
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        x: table.x,
        y: table.y,
        width: table.width,
        height: table.height,
        scale: isSelected && mode === "combine" ? 1.04 : 1,
      }}
      transition={{ type: "spring", stiffness: 700, damping: 36, mass: 0.3 }}
      onPointerDown={onPointerDown}
      className={cn(
        "absolute flex flex-col items-center justify-center gap-1 backdrop-blur-luxe transition-shadow",
        mode === "move" ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isSelected && "z-10",
        isSelected &&
          mode === "move" &&
          "ring-2 ring-gold ring-offset-2 ring-offset-charcoal-300",
        isSelected &&
          mode === "combine" &&
          "ring-4 ring-gold ring-offset-2 ring-offset-charcoal-300",
        isDirty && !isSelected && "ring-1 ring-gold/40",
        table.shape === "circle" ? "rounded-full" : "rounded-xl",
      )}
      style={{
        backgroundColor: statusBg[table.status],
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: groupColor ?? statusBorder[table.status],
        boxShadow: isSelected
          ? "0 0 32px rgba(212,175,55,0.55), inset 0 0 0 1px rgba(212,175,55,0.5)"
          : "0 8px 28px -8px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.05)",
      }}
    >
      <span className="font-display text-2xl font-bold text-ivory">
        {table.label}
      </span>
      <span className="flex items-center gap-1 font-korean text-[11px] text-ivory/55">
        <Users className="h-3 w-3" strokeWidth={1.6} />
        {table.capacity}석
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-1 font-korean text-[11px] font-medium",
          STATUS_META[table.status].color,
        )}
      >
        <StatusIcon className="h-3 w-3" strokeWidth={1.8} />
        {STATUS_META[table.status].label}
      </span>

      {/* dirty 표시 */}
      {isDirty && mode === "move" && (
        <span className="absolute -right-1 -top-1 inline-block h-2 w-2 rounded-full bg-gold shadow-gold-glow" />
      )}

      {/* 합치기 모드 체크마크 */}
      {mode === "combine" && isSelected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold text-charcoal-900 shadow-gold-glow"
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </motion.span>
      )}

      {/* 리사이즈 핸들 (우하단 모서리) — 이동 모드에서만 */}
      {mode === "move" && (
        <div
          onPointerDown={onResizeStart}
          className="absolute right-0 bottom-0 z-20 flex h-7 w-7 cursor-nwse-resize items-end justify-end p-1"
          style={{ touchAction: "none" }}
          aria-label="크기 조절"
          title="끌어서 크기 조절"
        >
          <span
            className="block h-3 w-3 rounded-br-md border-b-2 border-r-2 border-gold/80"
            style={{
              boxShadow: "0 0 8px rgba(212,175,55,0.5)",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

// =========================================================
// Helpers
// =========================================================
function Stat({
  label,
  value,
  accent,
  dotColor,
}: {
  label: string;
  value: number;
  accent?: boolean;
  dotColor?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {dotColor && <span className={cn("h-2 w-2 rounded-full", dotColor)} />}
      <span className="font-korean text-xs text-ivory/55">{label}</span>
      <span
        className={cn(
          "font-display text-lg font-bold tabular-nums",
          accent ? "text-gold" : "text-ivory",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ToolbarButton({
  onClick,
  disabled,
  icon,
  tone,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  tone?: "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-korean text-sm font-medium transition-all",
        disabled && "opacity-40",
        !disabled &&
          tone === "danger" &&
          "border-burgundy/40 text-burgundy hover:bg-burgundy hover:text-ivory",
        !disabled &&
          !tone &&
          "border-gold/25 text-ivory/80 hover:border-gold/60 hover:text-gold",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function LegendPanel() {
  return (
    <div className="rounded-2xl border border-gold/15 bg-charcoal-100/40 p-5 backdrop-blur-luxe">
      <h4 className="mb-3 font-korean text-sm font-semibold text-gold">사용법</h4>
      <ul className="grid gap-2 font-korean text-sm leading-relaxed text-ivory/75 sm:grid-cols-2">
        <li>· <span className="text-gold">탭</span> — 주문 화면 열기 (이 테이블의 청구서·메뉴 추가·결제)</li>
        <li>· <span className="text-gold">드래그</span> — 테이블 위치 이동 (격자 스냅)</li>
        <li>· <span className="text-gold">우하단 모서리 드래그</span> — 테이블 크기 조절</li>
        <li>· <span className="text-gold">합치기 모드</span> — 여러 테이블을 그룹화 (그룹 총액 자동 계산)</li>
        <li>· 주문 드로어에서 <span className="text-gold">다른 테이블과 합산</span>으로 일행이 흩어져있을 때도 한 번에 계산.</li>
        <li>· 변경 후 <span className="text-gold">[저장]</span> 클릭 필수.</li>
      </ul>
    </div>
  );
}
