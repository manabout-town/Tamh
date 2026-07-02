"use client";

/**
 * AmbientBackground — 정적인 럭셔리 배경 레이어.
 * 라디얼 골드 글로우 + 미세한 노이즈 + 빈티지한 비네팅.
 * iPad에서 부드럽게 보이도록 `will-change` 제거, 정적 그래디언트만 사용.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="ambient-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* 골드 글로우 (좌상) */}
      <div
        className="absolute -left-32 -top-32 h-[40rem] w-[40rem] rounded-full opacity-[0.18] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,1) 0%, transparent 65%)",
        }}
      />
      {/* 와인 톤 글로우 (우하) */}
      <div
        className="absolute -bottom-40 -right-40 h-[44rem] w-[44rem] rounded-full opacity-[0.22] blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(92,31,44,1) 0%, transparent 60%)",
        }}
      />
      {/* 비네팅 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}
