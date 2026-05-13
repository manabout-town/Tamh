"use client";

/**
 * Supabase — Browser Client
 *
 * 클라이언트 컴포넌트 / Realtime 구독용.
 * `@supabase/ssr`의 `createBrowserClient`를 사용해 쿠키 동기화까지 자동 처리한다.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { DatabaseSchema } from "@/types/database";

export function createSupabaseBrowserClient() {
  return createBrowserClient<DatabaseSchema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    },
  );
}

/** 싱글톤 — 컴포넌트 트리에서 재생성 방지 */
let _browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!_browserClient) _browserClient = createSupabaseBrowserClient();
  return _browserClient;
}
