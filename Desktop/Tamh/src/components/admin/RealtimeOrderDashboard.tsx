"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Clock,
  CheckCircle2,
  CreditCard,
  XCircle,
  Hash,
  Coffee,
  Loader2,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatKRW, timeAgo, cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/database";

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }
> = {
  PENDING: { label: "대기", color: "text-gold", icon: Clock },
  SERVED: { label: "서빙", color: "text-cognac", icon: CheckCircle2 },
  PAID: { label: "결제", color: "text-emerald-400", icon: CreditCard },
  CANCELED: { label: "취소", color: "text-burgundy", icon: XCircle },
};

export function RealtimeOrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("PENDING");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 초기 로드 + Realtime 구독
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const load = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setOrders(data ?? []);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev]);
          // 알림음
          try {
            audioRef.current?.play();
          } catch {
            /* autoplay blocked */
          }
          // 진동 (모바일)
          if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate?.(200);
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updated = payload.new as Order;
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from("orders").update({ status }).eq("id", id);
  };

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    pending: orders.filter((o) => o.status === "PENDING").length,
    served: orders.filter((o) => o.status === "SERVED").length,
    paid: orders.filter((o) => o.status === "PAID").length,
    revenue: orders
      .filter((o) => o.status === "PAID")
      .reduce((acc, o) => acc + o.total_price, 0),
  };

  return (
    <div>
      {/* Sound */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRhwMAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfgLAAAAAAAA"
        preload="auto"
      />

      {/* Stat cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Clock className="h-5 w-5" strokeWidth={1.5} />}
          label="대기 중"
          value={stats.pending}
          accent
        />
        <StatCard
          icon={<Coffee className="h-5 w-5" strokeWidth={1.5} />}
          label="서빙 완료"
          value={stats.served}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />}
          label="결제 완료"
          value={stats.paid}
        />
        <StatCard
          icon={<CreditCard className="h-5 w-5" strokeWidth={1.5} />}
          label="오늘 매출"
          value={`₩${formatKRW(stats.revenue)}`}
        />
      </div>

      {/* Filter */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {(["ALL", "PENDING", "SERVED", "PAID", "CANCELED"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs uppercase tracking-widest2 transition-all",
                filter === s
                  ? "border-gold bg-gold text-charcoal-900"
                  : "border-gold/20 bg-charcoal-100/30 text-ivory/70 hover:border-gold/50 hover:text-gold",
              )}
            >
              {s === "ALL" ? "전체" : STATUS_META[s].label}
            </button>
          ),
        )}
        <div className="ml-auto inline-flex items-center gap-2 text-xs text-ivory/50">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          실시간 연결됨
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-gold" strokeWidth={1.5} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-24 text-center">
          <Bell className="h-10 w-10 text-gold/30" strokeWidth={1} />
          <p className="mt-4 font-serif text-base italic text-ivory/50">
            해당 상태의 주문이 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdate={updateStatus}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-card p-5",
        accent && "border-gold/40 shadow-gold-glow",
      )}
    >
      <div className="flex items-center gap-3 text-ivory/60">
        <span className="text-gold">{icon}</span>
        <span className="font-serif text-xs uppercase tracking-widest2">
          {label}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl text-ivory">{value}</p>
    </div>
  );
}

function OrderCard({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (id: string, status: OrderStatus) => void;
}) {
  const StatusIcon = STATUS_META[order.status].icon;
  return (
    <motion.article
      layout
      initial={{ scale: 0.92, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "glass-card group relative flex flex-col p-5",
        order.status === "PENDING" && "animate-gold-pulse border-gold/40",
      )}
    >
      <header className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-gold" strokeWidth={1.5} />
          <span className="font-display text-2xl text-ivory">
            Table {order.table_number}
          </span>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest2",
            order.status === "PENDING" && "border-gold/40 text-gold",
            order.status === "SERVED" && "border-cognac/40 text-cognac",
            order.status === "PAID" && "border-emerald-400/40 text-emerald-400",
            order.status === "CANCELED" && "border-burgundy/40 text-burgundy",
          )}
        >
          <StatusIcon className="h-3 w-3" strokeWidth={1.8} />
          {STATUS_META[order.status].label}
        </div>
      </header>

      <ul className="my-4 flex-1 space-y-2 text-sm">
        {order.items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between gap-3 text-ivory/80"
          >
            <span className="font-serif">
              {item.name}{" "}
              <span className="text-gold/80">× {item.quantity}</span>
            </span>
            <span className="font-serif text-ivory/55">
              ₩{formatKRW(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {order.memo && (
        <p className="mb-3 rounded-md border border-gold/15 bg-charcoal-100/40 px-3 py-2 font-serif text-xs italic text-ivory/65">
          📝 {order.memo}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-gold/10 pt-3 text-sm">
        <span className="text-xs text-ivory/40">{timeAgo(order.created_at)}</span>
        <span className="font-serif text-lg text-gold">
          ₩{formatKRW(order.total_price)}
        </span>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {order.status === "PENDING" && (
          <button
            onClick={() => onUpdate(order.id, "SERVED")}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-cognac/40 bg-cognac/10 px-3 py-2 text-[11px] uppercase tracking-widest2 text-cognac transition-colors hover:bg-cognac hover:text-charcoal-900"
          >
            <Coffee className="h-3.5 w-3.5" strokeWidth={1.8} />
            서빙
          </button>
        )}
        {order.status === "SERVED" && (
          <button
            onClick={() => onUpdate(order.id, "PAID")}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 text-[11px] uppercase tracking-widest2 text-emerald-400 transition-colors hover:bg-emerald-400 hover:text-charcoal-900"
          >
            <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} />
            결제 완료
          </button>
        )}
        {(order.status === "PENDING" || order.status === "SERVED") && (
          <button
            onClick={() => onUpdate(order.id, "CANCELED")}
            className="inline-flex items-center justify-center gap-1 rounded-full border border-burgundy/30 px-3 py-2 text-[11px] uppercase tracking-widest2 text-burgundy/80 transition-colors hover:bg-burgundy hover:text-ivory"
          >
            <XCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            취소
          </button>
        )}
      </div>
    </motion.article>
  );
}
