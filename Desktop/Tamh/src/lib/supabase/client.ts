"use client";

/**
 * Supabase — Browser Client
 *
 * 클라이언트 컴포넌트 / Realtime 구독용.
 * Type generics는 제거(@supabase/ssr 2.x와 우리 스키마 간 호환성 이슈 우회).
 * 응답 데이터는 호출부에서 `as Menu` 등으로 명시적 캐스팅.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    },
  );
}

let _browserClient: ReturnType<typeof createSupabaseBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!_browserClient) _browserClient = createSupabaseBrowserClient();
  return _browserClient;
}
