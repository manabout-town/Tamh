# TÀMH — 럭셔리 바 디지털 메뉴 시스템

> *"Time, slowly poured into a glass."*

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-FF0055?logo=framer)](https://framer.com/motion)
[![Live](https://img.shields.io/badge/Live-tamh--bar.vercel.app-000?logo=vercel)](https://tamh-bar.vercel.app/menu)

---

## 개요

TÀMH는 Single Malt · Cocktail · Bar 운영을 위한 **iPad 전용 디지털 메뉴판 웹앱**이다.  
손님에게는 세련된 위스키 카탈로그를, 관리자에게는 가격 편집·메뉴 관리·품절 처리를 실시간으로 제공한다.

**Live →** https://tamh-bar.vercel.app/menu

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Database / Auth | Supabase (PostgreSQL + RLS) |
| Hosting | Vercel |

---

## 페이지 구성

| 경로 | 설명 | 렌더링 |
|------|------|--------|
| `/menu` | 메인 메뉴판 (손님 / 관리자 공용) | SSR |
| `/soldout` | 품절 현황 보드 | SSR |
| `/detail` | 위스키 상세 탐색 (태그 필터 + 검색) | CSR |

루트(`/`)는 `/menu`로 자동 리다이렉트.

---

## 기능 상세

### 메뉴판 (`/menu`)

| 기능 | 설명 |
|------|------|
| **탭 3종** | 위스키 · 칵테일 · 푸드 |
| **서브 카테고리 필터** | 탭 내 카테고리별 빠른 이동 |
| **위클리 이벤트** | `is_recommended` 위스키를 별도 섹션으로 강조, 원가/할인가 동시 표시 |
| **전체 검색** | 영문·한글 동시 검색 |
| **품절 표시** | 취소선 + 빨간 뱃지 |

### 위스키 상세 (`/detail`)
- 원산지 / ABV / 캐스크 타입 상세 정보
- 태그 기반 다중 필터 (Peaty, Sherried, Fruity 등)
- 실시간 텍스트 검색

### 관리자 모드

우상단 🔒 버튼 → **PIN 4자리** 입력으로 잠금 해제. 세션(탭) 종료 시 자동 잠금.

| 관리 기능 | 설명 |
|-----------|------|
| **가격 인라인 편집** | 잔 가격 / 병 가격 셀 직접 수정 |
| **메뉴 CRUD** | 추가 · 수정 · 삭제 (모달 폼) |
| **품절 관리** | `/soldout` 페이지에서 일괄 관리 · 인라인 토글 |
| **위클리 이벤트 지정** | `is_recommended` 토글로 이벤트 메뉴 지정 |

---

## 데이터베이스 스키마

```sql
-- categories
id uuid PK | name text | subtitle text | priority int | icon text | created_at

-- menus
id uuid PK | category_id uuid FK | name text | name_ko text | description text
price int | bottle_price int | event_price int | image_url text
origin text | abv numeric(4,1) | cask_type text
is_active bool | is_recommended bool | created_at | updated_at
```

전체 스키마 + 시드 데이터: [`supabase/data.sql`](supabase/data.sql)  
RLS 정책: [`supabase/rls-lock.sql`](supabase/rls-lock.sql)

---

## 빠른 시작

```bash
git clone https://github.com/manabout-town/Tamh.git
cd Tamh

npm install

cp .env.example .env.local
# .env.local에 아래 환경변수 입력

npm run dev
# → http://localhost:3000/menu
```

### 환경변수

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PIN=1234
```

---

## Supabase 셋업

Supabase SQL Editor에서 순서대로 실행:

```
supabase/data.sql      — 테이블 생성 + 전체 메뉴 시드
supabase/rls-lock.sql  — RLS 정책 적용
```

Database → Replication → `menus`, `categories` Realtime 활성화.

---

## 배포

```bash
# Vercel CLI 직접
vercel --prod --yes

# 또는 환경변수 자동 등록 포함 스크립트
bash deploy.sh
```

**Vercel 프로젝트**: `manabouttowns-projects / tamh-bar`

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                 # / → /menu 리다이렉트
│   ├── menu/page.tsx            # 메인 메뉴판 (SSR)
│   ├── soldout/page.tsx         # 품절 현황 (SSR)
│   ├── detail/page.tsx          # 위스키 상세 탐색 (CSR)
│   └── api/admin/
│       ├── menus/route.ts       # GET 전체 / POST 생성
│       ├── menus/[id]/route.ts  # PUT 수정 / DELETE 삭제
│       └── verify/route.ts      # PIN 검증
├── components/
│   ├── layout/
│   │   ├── AmbientBackground.tsx
│   │   ├── SiteHeader.tsx
│   │   └── SiteFooter.tsx
│   └── menu/
│       ├── MenuBoard.tsx         # 메뉴 전체 컨테이너
│       ├── CleanMenuBoard.tsx    # 클린 레이아웃 보드
│       ├── CleanMenuRow.tsx      # 위스키 행 (인라인 편집)
│       ├── MenuCardGrid.tsx      # 칵테일 · 푸드 카드 그리드
│       ├── MenuFormModal.tsx     # 메뉴 추가 / 수정 모달
│       ├── PinModal.tsx          # 관리자 PIN 인증
│       ├── SoldoutBoard.tsx      # 품절 현황 보드
│       └── WeeklyEventModal.tsx  # 위클리 이벤트 관리
└── lib/
    ├── supabase/
    │   ├── client.ts            # 브라우저 클라이언트
    │   ├── server.ts            # 서버 클라이언트 (SSR)
    │   └── admin-client.ts      # 서비스롤 클라이언트 (관리자 API)
    ├── use-admin-mode.ts        # PIN 인증 · 세션 훅
    ├── admin-api.ts             # 관리자 API 호출 유틸
    ├── category-groups.ts       # 탭 · 카테고리 그룹 정의
    ├── whisky-details.ts        # 위스키 상세 데이터
    ├── cocktail-data.ts         # 칵테일 데이터
    └── food-data.ts             # 푸드 데이터
```

---

## iPad 최적화

- 가로모드(landscape) 기준 레이아웃 — 스크롤 없이 한 화면 표시
- 터치 타겟 최소 44px 준수
- iPad 해상도(1024×768~) 기준 폰트·여백 설계
- 카운터 직원이 iPad로 직접 조작하는 운영 시나리오 기준

---

Made with 🥃 for **TÀMH**
