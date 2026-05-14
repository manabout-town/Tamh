# TÀMH — POS for Single Malt Bar

> *"Time, slowly poured into a glass."*

TÀMH의 운영용 POS 시스템.
Next.js 14 (App Router) · Tailwind · Framer Motion · Supabase.

## 🧭 구성

상단 탭은 **메뉴 / 매장** 두 개로 단순화되어 있습니다.

### 메뉴 (Menu)
- 영문 · 한글 · 가격(잔/병)만 표시되는 심플 카드.
- 가격을 **탭하면 인라인 편집** → Enter 또는 ✓ 클릭으로 즉시 Supabase에 저장.
- 카테고리 필터 + 검색 (영문/한글).
- 메뉴 이미지는 UI에서 비노출(DB 필드는 유지).

### 매장 (Store) — POS 도면
- 드래그로 테이블을 **자유 배치** (격자 스냅 20px).
- Shift / ⌘ / Ctrl + 클릭으로 **다중 선택** → 함께 이동.
- 2개 이상 선택 후 [묶기]로 **그룹** 만들기 (점선 박스로 시각화).
- 테이블 상세 패널에서 라벨/좌석수/상태(빈자리·사용중·예약·닫힘) 변경.
- 좌표 변경은 [저장] 클릭으로 영구 반영 (변경된 항목 수 카운트 표시).
- **Realtime 동기화** — 다른 직원이 변경한 내용이 즉시 반영됩니다.

## 🚀 빠른 시작

```bash
cd Tamh
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

http://localhost:3000 → 자동으로 `/menu` 로 리다이렉트.

## 🗄️ Supabase 셋업

1. **SQL Editor** 에서 차례로 실행:
   - `supabase/schema.sql` — 테이블/RLS/Realtime 등록
   - `supabase/seed.sql` — TÀMH 실제 메뉴 213종 적재
   - `supabase/tables-seed.sql` — 도면 초기 테이블 8개

2. **Database → Replication**
   - `supabase_realtime` 게시물에서 `tables`, `menus`, `orders` Enable.

3. **(선택) Auth**
   - 매장 내부망 가정으로 RLS가 익명 접근을 허용합니다. 외부 노출 시 Supabase Auth + 정책 격상 필요.

## 📁 디렉토리

```
src/
├── app/
│   ├── layout.tsx          # 헤더(메뉴/매장 탭) + 푸터
│   ├── page.tsx            # /menu 로 리다이렉트
│   ├── menu/page.tsx       # 메뉴 보드
│   └── store/page.tsx      # 매장 도면
├── components/
│   ├── layout/             # SiteHeader, SiteFooter, AmbientBackground
│   ├── menu/
│   │   ├── MenuBoard.tsx   # 검색·필터·카테고리 묶음
│   │   └── MenuRow.tsx     # 한 줄 메뉴 + 인라인 가격 편집
│   └── store/
│       └── FloorPlan.tsx   # 드래그·그룹·상태 변경
├── lib/
│   ├── supabase/           # 브라우저/서버 클라이언트
│   └── utils.ts
└── types/database.ts
supabase/
├── schema.sql              # categories / menus / table_groups / tables / orders
├── seed.sql                # 메뉴 213종
└── tables-seed.sql         # 매장 초기 테이블 8개
```

## 🎨 디자인 토큰

| Token    | Hex         |
| -------- | ----------- |
| Charcoal | `#0A0A0B`   |
| Gold     | `#D4AF37`   |
| Ivory    | `#F5F1E8`   |
| Cognac   | `#C2854D`   |
| Burgundy | `#5C1F2C`   |

폰트: Italiana (display) · Cormorant (serif) · Inter (sans)

---

Made with 🥃 for **TÀMH**
