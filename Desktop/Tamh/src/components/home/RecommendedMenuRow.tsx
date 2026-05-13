"use client";

import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatGlassBottle, formatKRW } from "@/lib/utils";
import type { Menu } from "@/types/database";

// Fallback (DB가 비어있을 때 — 디자인 시연용)
const FALLBACK: Menu[] = [
  {
    id: "demo-1",
    category_id: "demo",
    name: "Macallan 18y",
    name_ko: "맥켈란 18년",
    description:
      "셰리 캐스크 숙성의 깊은 향. 라이트하면서도 묵직한 여운이 매혹적인 한 잔.",
    price: 53000,
    bottle_price: 1100000,
    image_url: null,
    is_active: true,
    is_recommended: true,
    origin: "Speyside",
    abv: 43,
    cask_type: "Sherry Cask",
    created_at: "",
    updated_at: "",
  },
  {
    id: "demo-2",
    category_id: "demo",
    name: "Hibiki 21",
    name_ko: "히비키 21년",
    description: "일본의 정교한 블렌딩이 만들어낸 부드럽고 화사한 향.",
    price: 120000,
    bottle_price: 1500000,
    image_url: null,
    is_active: true,
    is_recommended: true,
    origin: "Japan",
    abv: 43,
    cask_type: "Blended",
    created_at: "",
    updated_at: "",
  },
  {
    id: "demo-3",
    category_id: "demo",
    name: "Octomore 14.1",
    name_ko: "옥토모어 14.1",
    description:
      "세상에서 가장 강한 피트의 한 모금. 강렬한 스모키 뒤로 따라오는 우아한 단맛.",
    price: 55000,
    bottle_price: 1200000,
    image_url: null,
    is_active: true,
    is_recommended: true,
    origin: "Islay",
    abv: 59.1,
    cask_type: "Ex-Bourbon",
    created_at: "",
    updated_at: "",
  },
];

export function RecommendedMenuRow({ items }: { items: Menu[] }) {
  const list = items.length ? items : FALLBACK;
  const { add } = useCart();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((m, i) => (
        <motion.article
          key={m.id}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.08, duration: 0.6 }}
          className="glass-card gold-border group relative flex flex-col overflow-hidden"
        >
          {/* Image / accent block */}
          <div
            className="relative aspect-[5/4] w-full overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(212,175,55,0.18) 0%, transparent 60%), linear-gradient(180deg, rgba(20,20,24,0.6), rgba(10,10,11,1))",
            }}
          >
            {m.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.image_url}
                alt={m.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="display-heading text-[10rem] leading-none text-gold/10">
                  {m.name.slice(0, 1)}
                </span>
              </div>
            )}

            {/* Tag */}
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-charcoal-100/70 px-3 py-1.5 text-[10px] uppercase tracking-widest2 text-gold backdrop-blur-luxe">
              <Sparkles className="h-3 w-3" strokeWidth={1.5} />
              Signature
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-6">
            <h3 className="display-heading text-2xl text-ivory">{m.name}</h3>
            {m.name_ko && (
              <p className="mt-1 font-serif text-sm text-ivory/60">
                {m.name_ko}
              </p>
            )}

            <p className="mt-4 line-clamp-3 flex-1 font-serif text-sm leading-relaxed text-ivory/70">
              {m.description ??
                "바텐더가 직접 큐레이션한 오늘의 한 잔. 천천히 음미하는 시간을 위해."}
            </p>

            <div className="mt-6 flex items-end justify-between gap-3">
              <div>
                <p className="font-serif text-[10px] uppercase tracking-widest2 text-ivory/40">
                  Glass · 30ml / Bottle
                </p>
                <p className="mt-1 font-serif text-xl text-gold">
                  ₩{formatGlassBottle(m.price, m.bottle_price)}
                </p>
              </div>

              <button
                onClick={() =>
                  add({
                    menu_id: m.id,
                    name: m.name_ko ?? m.name,
                    price: m.price,
                    quantity: 1,
                  })
                }
                className="group/btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold transition-all hover:bg-gold hover:text-charcoal-900"
                aria-label={`${m.name} 장바구니에 추가`}
              >
                <Plus className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
