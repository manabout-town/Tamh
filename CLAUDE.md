# TÀMH — 바 디지털 메뉴판

iPad 가로모드용 메뉴판 웹앱. Next.js 14 App Router + Supabase.

**작업을 이어받는 경우 `docs/HANDOFF.md` 를 먼저 읽으세요.**
지금까지 한 것과 남은 것이 정리돼 있습니다.

## 구조

- `src/app/menu` — 메뉴판 (메인). `/` 는 여기로 리다이렉트
- `src/app/detail` — 위스키 상세, `src/app/soldout` — 품절 관리
- `src/components/menu/` — 위스키는 `CleanMenuRow`(리스트), 칵테일·푸드는 `MenuCardGrid`(카드)
- `src/lib/menu-store.ts` — **모든 메뉴 읽기·쓰기는 여기를 지나갑니다.**
  Supabase 환경변수가 있으면 Supabase, 없으면 `static-db.ts` 로 폴백
- `src/app/api/admin/*` — 관리자 CRUD. `x-admin-pin` 헤더를 `ADMIN_PIN` 과 대조

## 규칙

- 관리자 쓰기는 반드시 API Route 를 거칩니다. 클라이언트에서 Supabase 에 직접 쓰지 않습니다
  (RLS 가 `anon` 에 SELECT 만 허용).
- `cocktail-data.ts` 와 `food-data.ts` 는 DB 값이 비었을 때만 쓰는 예비값입니다.
  화면은 항상 DB 값을 먼저 읽어야 합니다.
- 메뉴 사진은 `public/menu/` 에 두고 `/menu/<이름>.jpg` 로 참조합니다.
  `scripts/fit_menu_image.py` 가 1200x1200 정사각형으로 맞춰줍니다.
- 카드와 미리보기는 `next/image` 대신 `img` 를 씁니다. 관리자가 임의 호스트 주소를
  넣어도 깨지지 않게 하기 위한 것이니 되돌리지 마세요.

## 명령

```bash
npm run dev          # 개발 서버
npm run type-check   # 타입 검사
npm run build        # 프로덕션 빌드
bash deploy.sh       # Vercel 배포 (프로젝트에 깃 연동 없음)
```

ESLint 설정은 레포에 없습니다. `npm run lint` 는 초기 설정을 물어보니 쓰지 마세요.
