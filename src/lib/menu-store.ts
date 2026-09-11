/**
 * TÀMH — 메뉴 데이터 저장소 (서버 전용)
 *
 * Supabase 환경변수가 설정되어 있으면 Supabase를 사용하고,
 * 없으면 static-db.ts 의 메모리 데이터로 폴백합니다.
 *
 * 폴백은 로컬 개발과 키 누락 상황에서 화면이 죽지 않게 하기 위한 것으로,
 * 폴백 상태에서의 수정은 서버 재시작 전까지만 유지됩니다.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { db as staticDb } from "./static-db";
import type { Category, Menu } from "@/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** 값이 채워져 있고 .env.example 의 자리표시자가 아닌지 확인 */
function isRealValue(v: string | undefined): v is string {
  return !!v && v.trim() !== "" && !v.includes("your-project") && !v.startsWith("your-");
}

export const isSupabaseEnabled =
  isRealValue(SUPABASE_URL) && isRealValue(SERVICE_ROLE_KEY);

let _client: SupabaseClient | null = null;

function client(): SupabaseClient {
  if (!_client) {
    _client = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
      // Next.js 는 서버에서 나가는 fetch 를 기본으로 캐싱합니다. 그대로 두면 관리자가
      // 값을 바꿔도 화면이 예전 응답을 계속 보여줍니다. 항상 DB 를 다시 읽게 합니다.
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, cache: "no-store" }),
      },
    });
  }
  return _client;
}

/** 클라이언트가 보내온 값 중 menus 테이블에 실제로 존재하는 컬럼만 통과시킵니다. */
const WRITABLE_FIELDS = [
  "category_id",
  "name",
  "name_ko",
  "description",
  "price",
  "bottle_price",
  "event_price",
  "image_url",
  "origin",
  "abv",
  "cask_type",
  "is_active",
  "is_recommended",
] as const;

type WritableField = (typeof WRITABLE_FIELDS)[number];

export function pickWritable(input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of WRITABLE_FIELDS) {
    if (key in input) out[key] = input[key as WritableField];
  }
  return out;
}

// =============================================================
// 읽기
// =============================================================

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseEnabled) return staticDb.getCategories();

  const { data, error } = await client()
    .from("categories")
    .select("*")
    .order("priority", { ascending: true });

  if (error) throw new Error(`카테고리를 불러오지 못했습니다: ${error.message}`);
  return (data ?? []) as Category[];
}

export async function getMenus(): Promise<Menu[]> {
  if (!isSupabaseEnabled) return staticDb.getMenus();

  const { data, error } = await client()
    .from("menus")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(`메뉴를 불러오지 못했습니다: ${error.message}`);
  return (data ?? []) as Menu[];
}

// =============================================================
// 쓰기
// =============================================================

export async function createMenu(payload: Record<string, unknown>): Promise<Menu> {
  const values = pickWritable(payload);

  if (!isSupabaseEnabled) {
    return staticDb.insertMenu({
      is_active: true,
      ...values,
    } as Omit<Menu, "id" | "created_at" | "updated_at">);
  }

  const { data, error } = await client()
    .from("menus")
    .insert({ is_active: true, ...values })
    .select()
    .single();

  if (error) throw new Error(`메뉴를 추가하지 못했습니다: ${error.message}`);
  return data as Menu;
}

export async function updateMenu(
  id: string,
  patch: Record<string, unknown>,
): Promise<Menu | null> {
  const values = pickWritable(patch);
  if (Object.keys(values).length === 0) return null;

  if (!isSupabaseEnabled) return staticDb.updateMenu(id, values as Partial<Menu>);

  const { data, error } = await client()
    .from("menus")
    .update(values)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(`메뉴를 수정하지 못했습니다: ${error.message}`);
  return (data as Menu | null) ?? null;
}

// =============================================================
// 이미지 업로드 (Supabase Storage)
// =============================================================

export const MENU_IMAGE_BUCKET = "menu-images";

function extensionFor(file: File): string {
  const fromName = file.name?.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const fromType = file.type?.split("/").pop()?.toLowerCase();
  return fromType && /^[a-z0-9]{2,5}$/.test(fromType) ? fromType : "jpg";
}

/** 메뉴 사진을 Storage에 올리고 공개 URL을 돌려줍니다. */
export async function uploadMenuImage(file: File): Promise<string> {
  if (!isSupabaseEnabled) throw new Error("Supabase가 설정되지 않았습니다.");

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`;

  const { error } = await client()
    .storage.from(MENU_IMAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) throw new Error(`이미지를 올리지 못했습니다: ${error.message}`);

  const { data } = client().storage.from(MENU_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteMenu(id: string): Promise<boolean> {
  if (!isSupabaseEnabled) return staticDb.deleteMenu(id);

  const { data, error } = await client()
    .from("menus")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(`메뉴를 삭제하지 못했습니다: ${error.message}`);
  return !!data;
}
