#!/bin/bash
# =============================================================
# TÀMH — Vercel 배포 스크립트
# 사용법: bash deploy.sh
# 사전 조건: 한 번이라도 `npx vercel login` 으로 인증해두기
# =============================================================

set -e

cd "$(dirname "$0")"
echo ""
echo "🥃  TÀMH — Vercel 배포 시작"
echo "================================="
echo ""

# 1. 환경변수 추출
if [ ! -f .env.local ]; then
  echo "❌ .env.local 파일이 없습니다."
  exit 1
fi

SUPA_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" .env.local | cut -d= -f2-)
SUPA_KEY=$(grep "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local | cut -d= -f2-)

if [ -z "$SUPA_URL" ] || [ -z "$SUPA_KEY" ]; then
  echo "❌ Supabase URL / anon key를 .env.local에서 찾을 수 없습니다."
  exit 1
fi

echo "✓ Supabase URL : $SUPA_URL"
echo "✓ Supabase Key : ${SUPA_KEY:0:30}…(중간 생략)"
echo ""

# 2. Vercel 로그인 확인
echo "──── Vercel 인증 확인 ────"
if ! npx --yes vercel@latest whoami > /dev/null 2>&1; then
  echo "🔐  로그인이 필요합니다. 브라우저가 열리면 인증해주세요."
  npx --yes vercel@latest login
fi
echo "✓ 로그인 OK"
echo ""

# 3. 프로젝트 링크 (최초 1회)
echo "──── 프로젝트 링크 ────"
if [ ! -f .vercel/project.json ]; then
  echo "📎  Vercel 프로젝트와 연결합니다 (이름: tamh-bar)."
  npx --yes vercel@latest link --yes --project tamh-bar
fi
echo "✓ Project linked"
echo ""

# 4. 환경변수 등록 (멱등)
echo "──── 환경변수 ────"
# 이전 값이 있을 수 있어 일단 삭제 → 다시 등록
for ENV in production preview development; do
  echo "  · $ENV 환경에 NEXT_PUBLIC_SUPABASE_URL"
  echo "$SUPA_URL" | npx --yes vercel@latest env add NEXT_PUBLIC_SUPABASE_URL $ENV 2>/dev/null || true
  echo "  · $ENV 환경에 NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "$SUPA_KEY" | npx --yes vercel@latest env add NEXT_PUBLIC_SUPABASE_ANON_KEY $ENV 2>/dev/null || true
done
echo "✓ 환경변수 등록 완료 (또는 이미 등록됨)"
echo ""

# 5. Production 배포
echo "──── Production 배포 ────"
npx --yes vercel@latest --prod --yes

echo ""
echo "✅  배포 완료!"
