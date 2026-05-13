import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind 클래스 충돌 자동 해결 + 조건부 클래스 처리 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 한국 원화 포맷 (예: 18,000) */
export function formatKRW(amount: number, withSymbol = false) {
  const formatted = new Intl.NumberFormat("ko-KR").format(amount);
  return withSymbol ? `₩${formatted}` : formatted;
}

/** 두 가격 (잔/병) 동시 노출 포맷 */
export function formatGlassBottle(glass: number, bottle: number | null) {
  if (bottle == null) return `${formatKRW(glass)}`;
  return `${formatKRW(glass)} / ${formatKRW(bottle)}`;
}

/** 시간 상대 표시 (예: 방금 전 · 3분 전) */
export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 10) return "방금 전";
  if (sec < 60) return `${sec}초 전`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  return `${day}일 전`;
}

/** 안전한 슬러그(URL용 영문/숫자/하이픈) */
export function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
