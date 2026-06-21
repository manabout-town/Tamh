# TÀMH — Digital Menu Board

> *"Time, slowly poured into a glass."*

Single Malt · Cocktail · Bar 운영용 디지털 메뉴판.  
Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Supabase.

**Live:** https://tamh-bar.vercel.app/menu

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/menu` | 메인 메뉴판 (손님 / 관리자 공용) |
| `/soldout` | 품절 관리 |
| `/detail` | 위스키 상세 정보 |

---

## 관리자 잠금

메뉴판은 기본적으로 **잠금 상태**로 노출됩니다.

- 우상단 🔒 버튼 → PIN 4자리 입력 → 관리자 모드 전환
- 관리자 모드에서 가능한 것:
  - 가격 인라인 편집 (잔 / 병)
  - 메뉴 추가 / 수정 / 삭제
  - 품절 관리
  - Weekly Event 지정
- 세션 종료(탭 닫기) 시 자동 잠금

---

## 메뉴 기능

- **탭 3종:** 위스키 · 칵테일 · 푸드
- **서브 카테고리 필터** — 탭 내 카테고리별 빠른 이동
- **위클리 이벤트** — `is_recommended` 위스키를 별도 섹션으로 강조, 이벤트가 포함된 경우 원가/할인가 동시 표시
- **전체 검색** — 영문 · 한글 동시 검색
- **품절 표시** — 품절 항목은 취소선 + 빨간 뱃지

---

## 빠른 시작

```bash
npm install
cp .env.example .env.local   # Supabase URL / anon key 입력
npm run dev
```

→ http://localhost:3000/menu

---

## Supabase 셋업

```sql
-- SQL Editor 에서 순서대로 실행
\i supabase/schema.sql   -- 테이블 / RLS
\i supabase/seed.sql     -- 메뉴 데이터
```

Database → Replication → `menus`, `categories` Realtime 활성화.

---

## 디렉토리

```
src/
├── app/
│   ├── menu/page.tsx          # 메인 메뉴판
│   ├── soldout/page.tsx       # 품절 관리
│   └── detail/page.tsx        # 위스키 상세
├── components/menu/
│   ├── CleanMenuBoard.tsx     # 메인 보드 (탭 · 검색 · 잠금)
│   ├── CleanMenuRow.tsx       # 위스키 행 (가격 인라인 편집)
│   ├── MenuCardGrid.tsx       # 칵테일 · 푸드 카드 그리드
│   ├── MenuFormModal.tsx      # 메뉴 추가 / 수정 모달
│   ├── PinModal.tsx           # 관리자 PIN 인증 모달
│   ├── SoldoutBoard.tsx       # 품절 관리 보드
│   └── WeeklyEventModal.tsx   # Weekly Event 관리
└── lib/
    ├── use-admin-mode.ts      # 관리자 잠금 훅 (sessionStorage)
    ├── category-groups.ts     # 탭 · 카테고리 그룹 정의
    ├── cocktail-data.ts
    ├── food-data.ts
    ├── whisky-details.ts
    └── supabase/              # 브라우저 / 서버 클라이언트
```

---

Made with 🥃 for **TÀMH**
