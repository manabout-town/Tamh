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

export async function adminDeleteMenu(id: string): Promise<void> {
  const res = await fetch(`/api/admin/menus/${id}`, {
    method: "DELETE",
    headers: { "x-admin-pin": getAdminPin() },
  });
  if (!res.ok) throw new Error(await res.text());
}
