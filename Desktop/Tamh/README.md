# TÀMH — Luxury Bar Digital Menu & Order System

> *"Time, slowly poured into a glass."*

TÀMH 바를 위한 **럭셔리 디지털 메뉴 + 실시간 주문 시스템**.
Next.js 14 (App Router) · Tailwind · Framer Motion · Supabase · Gemini 1.5 Flash 로 만들어졌습니다.

## ✨ 기능

### Guest View
- 시그니처 메뉴를 강조한 매거진 스타일의 메인.
- 카테고리별 스무스 필터링 + 부드러운 전환 애니메이션.
- 잡지 레이아웃의 메뉴 페이지 (피처 카드 + 그리드).
- 장바구니 (localStorage 영속화) → 테이블 번호 입력 → Supabase `orders` 실시간 삽입.

### Admin View (`/admin`)
- **Real-time Order Dashboard**: 새 주문이 들어오면 새로고침 없이 즉시 카드 표시 + 알림음/진동.
- 주문 상태 토글: PENDING → SERVED → PAID / CANCELED.
- **메뉴 관리** (`/admin/menus`): CRUD, 추천(시그니처) 토글, 활성/비활성.
- **Gemini 연동**: 메뉴 이름 입력 후 "Gemini로 생성" 버튼 → 우아한 문체의 설명문 자동 작성.

### 디자인
- 컨셉: **Gorgeous & Elegant** — Deep Charcoal · Black · Gold (#D4AF37)
- Glassmorphism (배경 블러) + 미세한 노이즈 텍스처 + 라디얼 골드 글로우.
- Serif (Cormorant Garamond) + Display Serif (Italiana) + Sans (Inter).
- 골드 테두리 글로우, 시머 애니메이션, 골드 펄스 등 마이크로 인터랙션.

---

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
cd Tamh
npm install
```

### 2. 환경변수 설정
`.env.example`을 `.env.local`로 복사 후 값 채우기:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      # 서버 전용
GEMINI_API_KEY=...                  # Gemini 설명문 자동 생성
ADMIN_PASSWORD=...                  # 추후 Admin 보호용
```

### 3. Supabase 셋업 (박 선생님 실무 가이드)

#### (a) 테이블 생성
1. Supabase 대시보드 → **SQL Editor** → New Query
2. `supabase/schema.sql` 내용 복붙 후 **Run**
3. 같은 자리에 `supabase/seed.sql` 복붙 후 **Run** (TÀMH 실제 메뉴 데이터 80개+)

#### (b) Storage 버킷 (이미지 업로드용)
1. Supabase → **Storage** → New bucket
2. 이름: `menu-images` · **Public bucket** 체크
3. (선택) Upload Policy: 인증된 사용자만 업로드 허용

#### (c) Realtime 활성화 🔔 *가장 중요*
1. Supabase → **Database** → **Replication**
2. `supabase_realtime` 게시물에서 **`orders` 테이블**을 **Enable**
3. 이 단계가 빠지면 사장님 폰으로 새 주문이 "띠링" 들어오지 않습니다.

### 4. 개발 서버 실행
```bash
npm run dev
```
- Guest: http://localhost:3000
- Menu:  http://localhost:3000/menu
- Admin: http://localhost:3000/admin

---

## 📁 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx              # 폰트, 헤더/푸터, 카트 프로바이더
│   ├── page.tsx                # 메인 (시그니처 강조)
│   ├── globals.css             # 럭셔리 다크 테마
│   ├── menu/page.tsx           # 매거진 레이아웃 메뉴 페이지
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # 실시간 주문 대시보드
│   │   └── menus/page.tsx      # 메뉴 CRUD
│   └── api/admin/generate-description/route.ts   # Gemini 호출
├── components/
│   ├── layout/                 # SiteHeader, SiteFooter, AmbientBackground
│   ├── home/                   # SignatureHero, RecommendedMenuRow
│   ├── menu/                   # MenuMagazineLayout, MenuCard, fallback-data
│   ├── cart/                   # CartProvider, CartDrawer
│   └── admin/                  # RealtimeOrderDashboard, MenuManager
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # 브라우저 클라이언트
│   │   └── server.ts           # 서버 / 어드민 클라이언트
│   └── utils.ts                # formatKRW, cn 등
└── types/
    └── database.ts             # Category, Menu, Order, OrderStatus
supabase/
├── schema.sql                  # 테이블 + RLS + 트리거 + Realtime 등록
└── seed.sql                    # TÀMH 실제 메뉴 시드
```

---

## 🎨 디자인 시스템 (요약)

| Token       | Value           |
| ----------- | --------------- |
| Charcoal    | `#0A0A0B`       |
| Gold        | `#D4AF37`       |
| Ivory       | `#F5F1E8`       |
| Burgundy    | `#5C1F2C`       |
| Cognac      | `#C2854D`       |

| Font Family | 사용처                |
| ----------- | --------------------- |
| Italiana    | 디스플레이 헤딩 (TÀMH) |
| Cormorant   | 본문 Serif            |
| Inter       | UI Sans               |

### 추가 디자인 팁 (필요시)
형님이 시안을 확인하고 더 살리고 싶으시다면 이렇게 말씀해주세요:
- "**카드 호버 시 골드 글로우를 더 강하게**" → `shadow-gold-glow-lg` + `gold-pulse` 추가
- "**배경에 노이즈를 더 진하게**" → `globals.css`의 `noise-overlay::after` opacity 증가
- "**히어로 영상으로 교체**" → `SignatureHero.tsx`의 우측 viz 블록을 `<video autoPlay muted loop>` 으로 교체

---

## 🔐 보안 노트

- `SUPABASE_SERVICE_ROLE_KEY`는 **절대** 클라이언트 코드/번들에 포함되면 안 됩니다.
- 현재 Admin 페이지는 라우트 보호가 없습니다. 운영 전에 아래 중 하나로 보호하세요:
  - Supabase Auth로 어드민 로그인 추가 (권장)
  - middleware로 ENV `ADMIN_PASSWORD` 기반 베이직 인증
- Guest는 `INSERT orders`만 허용 — RLS 정책이 schema.sql에 포함되어 있습니다.

---

## 🚧 다음 단계 아이디어

1. **OAuth Admin 로그인** (Supabase Auth + middleware 보호)
2. **이미지 업로드 UI** (`menu-images` 버킷, 드래그앤드롭)
3. **QR 코드 페이지** (테이블별 `?table=7` 자동 입력)
4. **카카오톡 채널 푸시** (Webhook으로 새 주문 알림)
5. **매출 리포트** (월별/카테고리별 통계 페이지)
6. **다국어** (영문/일본어 메뉴 토글)

---

Made with 🥃 for **TÀMH** · Single Malt & Cocktail Bar
