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

# SUPABASE_SERVICE_ROLE_KEY 가 없으면 서버가 정적 폴백으로 돌아가 수정이 저장되지 않습니다.
REQUIRED_VARS="NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY ADMIN_PIN"

for VAR in $REQUIRED_VARS; do
  VALUE=$(grep "^$VAR=" .env.local | cut -d= -f2-)
  if [ -z "$VALUE" ]; then
    echo "❌ .env.local 에 $VAR 이 없습니다."
    exit 1
  fi
  echo "✓ $VAR : ${VALUE:0:20}…"
done
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
  for VAR in $REQUIRED_VARS; do
    VALUE=$(grep "^$VAR=" .env.local | cut -d= -f2-)
    npx --yes vercel@latest env rm "$VAR" $ENV --yes > /dev/null 2>&1 || true
    printf '%s' "$VALUE" | npx --yes vercel@latest env add "$VAR" $ENV > /dev/null 2>&1 || true
    echo "  · $ENV / $VAR"
  done
done
echo "✓ 환경변수 등록 완료"
echo ""

# 5. Production 배포
echo "──── Production 배포 ────"
npx --yes vercel@latest --prod --yes

echo ""
echo "✅  배포 완료!"
