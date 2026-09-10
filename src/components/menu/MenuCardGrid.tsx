"use client";

import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { adminUpdateMenu } from "@/lib/admin-api";
import { cn, formatKRW } from "@/lib/utils";
import type { Menu } from "@/types/database";
import { COCKTAIL_DATA } from "@/lib/cocktail-data";
import { FOOD_DATA } from "@/lib/food-data";

interface Props {
  menus: Menu[];
  type: "cocktail" | "food";
  adminMode?: boolean;
  onEdit?: (menu: Menu) => void;
  onUpdated?: (menu: Menu) => void;
}

interface StaticInfo {
  image: string;
  desc?: string;
  alc?: string;
}

export function MenuCardGrid({ menus, type, adminMode = false, onEdit, onUpdated }: Props) {
  const dataMap: Record<string, StaticInfo> =
    type === "cocktail" ? COCKTAIL_DATA : FOOD_DATA;

  const items = menus.filter((m) => m.is_active !== false);
  const soldOut = menus.filter((m) => m.is_active === false);

  const cardProps = { dataMap, adminMode, onEdit, onUpdated };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((m) => (
          <MenuCard key={m.id} menu={m} {...cardProps} />
        ))}
      </div>

      {soldOut.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 font-korean text-xs font-semibold uppercase tracking-widest text-zinc-400">
            품절
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {soldOut.map((m) => (
              <MenuCard key={m.id} menu={m} soldOut {...cardProps} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  menu: Menu;
  dataMap: Record<string, StaticInfo>;
  soldOut?: boolean;
  adminMode?: boolean;
  onEdit?: (menu: Menu) => void;
  onUpdated?: (menu: Menu) => void;
}

function MenuCard({ menu, dataMap, soldOut, adminMode, onEdit, onUpdated }: CardProps) {
  const [toggling, setToggling] = useState(false);

  // 하드코딩된 표는 DB 값이 비어 있을 때만 쓰는 예비값입니다.
  const staticInfo = dataMap[menu.name_ko ?? menu.name] ?? dataMap[menu.name];

  const imageUrl = menu.image_url || staticInfo?.image || null;
  const desc = menu.description || staticInfo?.desc;
  const alc =
    menu.abv != null ? `${menu.abv}% alc./vol.` : staticInfo?.alc;

  const editable = adminMode && !!onEdit;

  const toggleSoldOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    try {
      onUpdated?.(await adminUpdateMenu(menu.id, { is_active: !menu.is_active }));
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      onClick={editable ? () => onEdit!(menu) : undefined}
      role={editable ? "button" : undefined}
      aria-label={editable ? `${menu.name} 수정` : undefined}
      tabIndex={editable ? 0 : undefined}
      onKeyDown={
        editable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onEdit!(menu);
              }
            }
          : undefined
      }
      className={cn(
        "group overflow-hidden rounded-2xl border bg-white transition-all",
        soldOut ? "border-zinc-100 opacity-50" : "border-zinc-200 hover:border-zinc-400",
        editable && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20 active:scale-[0.98]",
      )}
    >
      {imageUrl ? (
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
          {/* 관리자가 아무 호스트의 주소나 넣을 수 있어 next/image 대신 img 사용 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={menu.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-all duration-300",
              soldOut ? "grayscale" : "group-hover:scale-105",
            )}
          />
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="rounded-full bg-white/90 px-3 py-1 font-korean text-xs font-bold text-zinc-700">
                품절
              </span>
            </div>
          )}
          {editable && (
            <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-md">
              <Pencil className="h-4 w-4" strokeWidth={2} />
            </span>
          )}
        </div>
      ) : (
        <div className="relative aspect-square w-full bg-zinc-100 flex items-center justify-center">
          <span className="font-display text-3xl font-bold text-zinc-300">T</span>
          {editable && (
            <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-md">
              <Pencil className="h-4 w-4" strokeWidth={2} />
            </span>
          )}
        </div>
      )}

      <div className="p-3">
        <p
          className={cn(
            "font-display text-sm font-bold leading-snug",
            soldOut ? "text-zinc-400 line-through" : "text-black",
          )}
        >
          {menu.name}
        </p>
        {menu.name_ko && menu.name_ko !== menu.name && (
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
        <p
          className={cn(
            "mt-2 font-korean text-sm font-bold tabular-nums",
            soldOut ? "text-zinc-400" : "text-black",
          )}
        >
          ₩{formatKRW(menu.price)}
        </p>

        {adminMode && (
          <button
            type="button"
            onClick={toggleSoldOut}
            disabled={toggling}
            className={cn(
              "mt-2 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border font-korean text-xs font-semibold transition-all active:scale-95 disabled:opacity-60",
              soldOut
                ? "border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black"
                : "border-red-200 bg-red-50 text-red-700 hover:border-red-400",
            )}
          >
            {toggling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {soldOut ? "판매 재개" : "품절 표시"}
          </button>
        )}
      </div>
    </div>
  );
}
