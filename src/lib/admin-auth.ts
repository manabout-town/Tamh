/**
 * TÀMH — 관리자 PIN 검증 (서버 전용)
 */

import type { NextRequest } from "next/server";

/** ADMIN_PIN 이 설정되지 않았다면 어떤 요청도 통과시키지 않습니다. */
export function isAdminRequest(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PIN;
  if (!expected) return false;
  return req.headers.get("x-admin-pin") === expected;
}
