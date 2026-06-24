# TÀMH — Digital Menu Board

> *"Time, slowly poured into a glass."*

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-FF0055?logo=framer)](https://framer.com/motion)
[![Live](https://img.shields.io/badge/Live-tamh--bar.vercel.app-000?logo=vercel)](https://tamh-bar.vercel.app/menu)

---

## 개요

TÀMH는 Single Malt · Cocktail · Bar 운영을 위한 **디지털 메뉴판 웹앱**이다. 손님에게는 세련된 위스키 카탈로그를, 관리자에게는 가격 편집·메뉴 관리·품절 처리를 실시간으로 제공한다. 태블릿·스마트폰을 메뉴판으로 활용할 수 있도록 반응형으로 구현되어 있다.

**Live →** https://tamh-bar.vercel.app/menu

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Database / Auth | Supabase 2 |
| Hosting | Vercel |

---

## 기능 상세

### 메뉴판 (손님/관리자 공용)

| 기능 | 설명 |
|------|------|
| **탭 3종** | 위스키 · 칵테일 · 푸드 |
| **서브 카테고리 필터** | 탭 내 카테고리별 빠른 이동 |
| **위클리 이벤트** | `is_recommended` 위스키를 별도 섹션으로 강조, 원가/할인가 동시 표시 |
| **전체 검색** | 영문·한글 동시 검색 |
| **품절 표시** | 취소선 + 빨간 뱃지 |

### 관리자 모드

관리자 진입은 우상단 🔒 버튼 → **PIN 4자리** 입력으로 잠금 해제된다. 세션(탭) 종료 시 자동 잠금.

| 관리 기능 | 설명 |
|-----------|------|
| **가격 인라인 편집** | 잔 가격 / 병 가격 셀 직접 수정 |
| **메뉴 CRUD** | 추가 · 수정 · 삭제 |
| **품절 관리** | `/soldout` 페이지에서 일괄 관리 |
| **위클리 이벤트 지정** | `is_recommended` 토글로 이벤트 메뉴 지정 |

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/menu` | 메인 메뉴판 (손님 / 관리자 공용) |
| `/soldout` | 품절 항목 관리 |
| `/detail` | 위스키 상세 정보 |

---

## 로컬 개발 환경 설정

### 요구 사항

- Node.js 18+
- npm

### 설치 및 실행

```bash
git clone https://github.com/manabout-town/Tamh.git
cd Tamh/Desktop/Tamh
npm install
cp .env.example .env.local   # Supabase URL / anon key 입력
npm run dev
```

→ http://localhost:3000/menu

### 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase 테이블 초기화

`supabase/` 디렉터리의 SQL 마이그레이션을 순서대로 실행하거나 `supabase db push`를 사용한다.

---

## 디렉터리 구조

```
Desktop/Tamh/
├── src/
│   ├── app/
│   │   ├── menu/         # 메인 메뉴판
│   │   ├── soldout/      # 품절 관리
│   │   └── detail/       # 위스키 상세
│   └── components/
├── supabase/             # DB 마이그레이션
├── menu-preview.html     # 디자인 프리뷰
└── deploy.sh             # Vercel 배포 스크립트
```

---

## 라이선스

MIT
