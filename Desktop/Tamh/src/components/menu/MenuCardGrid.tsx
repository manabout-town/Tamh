"use client";

import Image from "next/image";
import { cn, formatKRW } from "@/lib/utils";
import type { Menu } from "@/types/database";
import { COCKTAIL_DATA } from "@/lib/cocktail-data";
import { FOOD_DATA } from "@/lib/food-data";

interface Props {
  menus: Menu[];
  type: "cocktail" | "food";
}

export function MenuCardGrid({ menus, type }: Props) {
  const dataMap = type === "cocktail" ? COCKTAIL_DATA : FOOD_DATA;

  const items = menus.filter((m) => m.is_active !== false);
  const soldOut = menus.filter((m) => m.is_active === false);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((m) => (
          <MenuCard key={m.id} menu={m} dataMap={dataMap} />
        ))}
      </div>

      {soldOut.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 font-korean text-xs font-semibold uppercase tracking-widest text-zinc-400">
            품절
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {soldOut.map((m) => (
              <MenuCard key={m.id} menu={m} dataMap={dataMap} soldOut />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  menu: Menu;
  dataMap: Record<string, { image: string; desc?: string; alc?: string }>;
  soldOut?: boolean;
}

function MenuCard({ menu, dataMap, soldOut }: CardProps) {
  const staticInfo = dataMap[menu.name];
  const imageUrl = menu.image_url || staticInfo?.image || null;
  const desc = staticInfo?.desc;
  const alc = "alc" in (staticInfo ?? {}) ? (staticInfo as { alc?: string }).alc : undefined;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition-all",
        soldOut ? "border-zinc-100 opacity-50" : "border-zinc-200 hover:border-zinc-400"
      )}
    >
      {imageUrl ? (
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
          <Image
            src={imageUrl}
            alt={menu.name}
            fill
            className={cn(
              "object-cover transition-all duration-300",
              soldOut ? "grayscale" : "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="rounded-full bg-white/90 px-3 py-1 font-korean text-xs font-bold text-zinc-700">
                품절
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square w-full bg-zinc-100 flex items-center justify-center">
          <span className="font-display text-3xl font-bold text-zinc-300">T</span>
        </div>
      )}

      <div className="p-3">
        <p className={cn("font-display text-sm font-bold leading-snug", soldOut ? "text-zinc-400 line-through" : "text-black")}>
          {menu.name}
        </p>
        {menu.name_ko && (
          <p className="mt-0.5 font-korean text-xs text-zinc-400 truncate">{menu.name_ko}</p>
        )}
        {desc && (
          <p className="mt-1 font-korean text-[11px] leading-relaxed text-zinc-500 line-clamp-2">
            {desc}
          </p>
        )}
        {alc && (
          <p className="mt-1 font-display text-[10px] uppercase tracking-widest text-zinc-400">
            {alc}
          </p>
        )}
        <p className={cn("mt-2 font-korean text-sm font-bold tabular-nums", soldOut ? "text-zinc-400" : "text-black")}>
          ₩{formatKRW(menu.price)}
        </p>
      </div>
    </div>
  );
}
