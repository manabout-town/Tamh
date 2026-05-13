/**
 * Supabase — Server Client (RSC / Route Handler / Server Action)
 *
 * Next.js App Router의 서버 환경에서 사용한다.
 * 쿠키 기반 세션을 다음 응답에 정확히 동기화하기 위해
 * `@supabase/ssr`의 createServerClient를 활용한다.
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { DatabaseSchema } from "@/types/database";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<DatabaseSchema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출 시 setAll은 무시 (middleware에서 처리)
          }
        },
      },
    },
  );
}

/**
 * 관리자/시스템 작업용 — service_role 권한 사용.
 * **클라이언트에 절대 노출 금지**, RSC/Route Handler에서만 사용.
 */
import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient() {
  return createClient<DatabaseSchema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
