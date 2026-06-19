"use client";

import { useEffect } from "react";
import type { Category, Menu } from "@/types/database";
import { CleanMenuBoard } from "./CleanMenuBoard";

interface Props {
  categories: Category[];
  menus: Menu[];
}

export function MenuBoard({ categories, menus }: Props) {
  // 항상 흰 배경 (라이트 모드) 활성화
  useEffect(() => {
    document.body.classList.add("view-mode-light");
    return () => {
      document.body.classList.remove("view-mode-light");
    };
  }, []);

  return <CleanMenuBoard categories={categories} menus={menus} />;
}
