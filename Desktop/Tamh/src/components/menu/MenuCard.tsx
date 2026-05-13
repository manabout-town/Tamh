"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles, MapPin, Droplet } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { cn, formatGlassBottle } from "@/lib/utils";
import type { Menu } from "@/types/database";

interface Props {
  menu: Menu;
  variant?: "feature" | "grid";
  index?: number;
}

export function MenuCard({ menu, variant = "grid", index = 0 }: Props) {
  const { add } = useCart();

  const handleAdd = () =>
    add({
      menu_id: menu.id,
      name: menu.name_ko ?? menu.name,
      price: menu.price,
      quantity: 1,
    });

  if (variant === "feature") {
    return (
      <motion.article
        initial={{ y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="glass-card gold-border group relative grid overflow-hidden lg:grid-cols-2"
      >
        {/* Visual */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-auto"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.20) 0%, transparent 65%), linear-gradient(180deg, rgba(20,20,24,0.7), rgba(10,10,11,1))",
          }}
        >
          {menu.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={menu.image_url}
              alt={menu.name}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="display-heading text-[20rem] leading-none text-gold/10">
                {menu.name.slice(0, 1)}
              </span>
            </div>
          )}
          <div className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-charcoal-100/70 px-3 py-1.5 text-[10px] uppercase tracking-widest2 text-gold backdrop-blur-luxe">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            Editor's Pick
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col justify-center p-10 lg:p-16">
          <p className="font-serif text-xs uppercase tracking-widest2 text-gold/80">
            Featured Bottle
          </p>
          <h3 className="display-heading mt-3 text-[clamp(2rem,4.5vw,3.5rem)] leading-none">
            {menu.name}
          </h3>
          {menu.name_ko && (
            <p className="mt-2 font-serif text-base italic text-ivory/65">
              {menu.name_ko}
            </p>
          )}

          {/* meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ivory/55">
            {menu.origin && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold/70" strokeWidth={1.5} />
                {menu.origin}
              </span>
            )}
            {menu.abv != null && (
              <span className="inline-flex items-center gap-1.5">
                <Droplet className="h-3.5 w-3.5 text-gold/70" strokeWidth={1.5} />
                {menu.abv}% ABV
              </span>
            )}
            {menu.cask_type && (
              <span className="rounded-full border border-gold/20 px-2 py-0.5">
                {menu.cask_type}
              </span>
            )}
          </div>

          <p className="mt-8 max-w-prose font-serif text-lg leading-relaxed text-ivory/80">
            {menu.description ??
              "한 잔의 시간을 만들어주는 깊이 있는 위스키. 천천히 음미하며 그날의 이야기를 이어가 보세요."}
          </p>

          <div className="mt-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-serif text-[10px] uppercase tracking-widest2 text-ivory/40">
                Glass · 30ml / Bottle
              </p>
              <p className="mt-1 font-serif text-3xl text-gold">
                ₩{formatGlassBottle(menu.price, menu.bottle_price)}
              </p>
            </div>
            <button onClick={handleAdd} className="btn-gold">
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  // GRID variant
  return (
    <motion.article
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="glass-card gold-border group relative flex flex-col"
    >
      <div
        className="relative aspect-[5/4] overflow-hidden rounded-t-2xl"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(212,175,55,0.12) 0%, transparent 60%), linear-gradient(180deg, rgba(20,20,24,0.6), rgba(10,10,11,1))",
        }}
      >
        {menu.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={menu.image_url}
            alt={menu.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="display-heading text-[8rem] leading-none text-gold/10">
              {menu.name.slice(0, 1)}
            </span>
          </div>
        )}

        {menu.is_recommended && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold/90 px-2 py-1 text-[9px] font-medium uppercase tracking-widest2 text-charcoal-900">
            <Sparkles className="h-2.5 w-2.5" strokeWidth={2} />
            Pick
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl uppercase tracking-widest text-ivory">
          {menu.name}
        </h3>
        {menu.name_ko && (
          <p className="mt-1 font-serif text-sm text-ivory/55">{menu.name_ko}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest2 text-ivory/45">
          {menu.origin && <span>{menu.origin}</span>}
          {menu.origin && menu.abv != null && <span>·</span>}
          {menu.abv != null && <span>{menu.abv}%</span>}
        </div>

        <p className="mt-4 line-clamp-3 flex-1 font-serif text-sm leading-relaxed text-ivory/65">
          {menu.description ??
            "셀렉트한 한 잔. 깊이 있는 향과 부드러운 여운을 기대해보세요."}
        </p>

        <div className="mt-6 flex items-end justify-between gap-3 border-t border-gold/10 pt-4">
          <p className="font-serif text-lg text-gold">
            ₩{formatGlassBottle(menu.price, menu.bottle_price)}
          </p>
          <button
            onClick={handleAdd}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full",
              "border border-gold/40 bg-gold/10 text-gold",
              "transition-all hover:bg-gold hover:text-charcoal-900",
            )}
            aria-label="장바구니에 추가"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
