"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatKRW, cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function CartDrawer() {
  const {
    items,
    tableNumber,
    setTableNumber,
    updateQty,
    remove,
    totalPrice,
    clear,
    isOpen,
    closeCart,
  } = useCart();

  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async () => {
    if (!tableNumber) {
      setError("테이블 번호를 입력해주세요.");
      return;
    }
    if (items.length === 0) return;
    setError(null);
    setSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: dbErr } = await supabase.from("orders").insert({
        table_number: tableNumber,
        items: items,
        total_price: totalPrice,
        status: "PENDING",
        memo: memo || null,
      });
      if (dbErr) throw dbErr;

      setSuccess(true);
      setTimeout(() => {
        clear();
        setMemo("");
        setSuccess(false);
        closeCart();
      }, 1800);
    } catch (e) {
      console.error(e);
      setError(
        "주문 전송에 실패했습니다. 잠시 후 다시 시도하거나 직원에게 문의해주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gold/20 bg-charcoal-200/95 backdrop-blur-luxe"
          >
            <header className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-gold" strokeWidth={1.5} />
                <h2 className="display-heading text-xl">Your Order</h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 text-ivory/60 transition-colors hover:bg-charcoal-100 hover:text-gold"
                aria-label="장바구니 닫기"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </header>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 luxe-scroll">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag
                    className="h-12 w-12 text-gold/20"
                    strokeWidth={1}
                  />
                  <p className="mt-4 font-serif text-base italic text-ivory/50">
                    아직 담긴 메뉴가 없습니다.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.menu_id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="glass-card flex items-center gap-3 p-3"
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gold/10 font-display text-2xl text-gold/80">
                          {item.name.slice(0, 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-base text-ivory">
                            {item.name}
                          </p>
                          <p className="text-xs text-gold">
                            ₩{formatKRW(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQty(item.menu_id, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold/15"
                            aria-label="수량 감소"
                          >
                            <Minus className="h-3 w-3" strokeWidth={2} />
                          </button>
                          <span className="w-6 text-center font-serif text-base text-ivory">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(item.menu_id, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold/15"
                            aria-label="수량 증가"
                          >
                            <Plus className="h-3 w-3" strokeWidth={2} />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(item.menu_id)}
                          className="ml-1 p-2 text-ivory/40 transition-colors hover:text-burgundy"
                          aria-label="삭제"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Order section */}
            {items.length > 0 && (
              <div className="border-t border-gold/15 px-6 py-5">
                {/* Table number */}
                <label className="block">
                  <span className="font-serif text-xs uppercase tracking-widest2 text-gold/80">
                    Table Number
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={tableNumber ?? ""}
                    onChange={(e) =>
                      setTableNumber(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="예: 7"
                    className="mt-2 w-full rounded-lg border border-gold/20 bg-charcoal-100/50 px-4 py-3 font-serif text-base text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
                  />
                </label>

                {/* Memo */}
                <label className="mt-3 block">
                  <span className="font-serif text-xs uppercase tracking-widest2 text-gold/80">
                    Note (선택)
                  </span>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="얼음 X, 물 1방울 등"
                    className="mt-2 w-full rounded-lg border border-gold/20 bg-charcoal-100/50 px-4 py-3 font-serif text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
                  />
                </label>

                {/* Total */}
                <div className="mt-5 flex items-center justify-between border-t border-gold/10 pt-4">
                  <span className="font-serif text-sm uppercase tracking-widest2 text-ivory/60">
                    Total
                  </span>
                  <span className="font-serif text-2xl text-gold">
                    ₩{formatKRW(totalPrice)}
                  </span>
                </div>

                {error && (
                  <p className="mt-3 rounded-lg border border-burgundy/40 bg-burgundy/10 p-3 text-xs text-ivory/80">
                    {error}
                  </p>
                )}

                <button
                  onClick={submitOrder}
                  disabled={submitting || success}
                  className={cn(
                    "btn-gold mt-4 w-full",
                    submitting && "opacity-70",
                  )}
                >
                  {success ? (
                    <>
                      <Check className="h-4 w-4" />
                      주문이 전달되었습니다
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      주문 전송 중…
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      주문하기 · ₩{formatKRW(totalPrice)}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
