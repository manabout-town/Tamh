"use client";

import type { Menu } from "@/types/database";

const PIN_KEY = "tamh-admin-pin";

export const getAdminPin = () =>
  typeof window !== "undefined" ? sessionStorage.getItem(PIN_KEY) ?? "" : "";

export const setAdminPin = (pin: string) => sessionStorage.setItem(PIN_KEY, pin);
export const clearAdminPin = () => sessionStorage.removeItem(PIN_KEY);

function adminHeaders() {
  return {
    "content-type": "application/json",
    "x-admin-pin": getAdminPin(),
  };
}

export async function verifyPin(pin: string): Promise<boolean> {
  const res = await fetch("/api/admin/verify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  return res.ok;
}

export async function adminCreateMenu(
  payload: Omit<Menu, "id" | "created_at" | "updated_at">,
): Promise<Menu> {
  const res = await fetch("/api/admin/menus", {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function adminUpdateMenu(
  id: string,
  updates: Partial<Omit<Menu, "id" | "created_at">>,
): Promise<Menu> {
  const res = await fetch(`/api/admin/menus/${id}`, {
    method: "PATCH",
    headers: adminHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** 메뉴 사진 업로드 — 성공하면 공개 이미지 URL을 돌려줍니다. */
export async function adminUploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "x-admin-pin": getAdminPin() },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || "업로드에 실패했습니다.";
    try {
      message = JSON.parse(text).error ?? message;
    } catch {
      // 본문이 JSON이 아니면 원문 그대로 사용
    }
    throw new Error(message);
  }

  const { url } = await res.json();
  return url as string;
}

export async function adminDeleteMenu(id: string): Promise<void> {
  const res = await fetch(`/api/admin/menus/${id}`, {
    method: "DELETE",
    headers: { "x-admin-pin": getAdminPin() },
  });
  if (!res.ok) throw new Error(await res.text());
}
