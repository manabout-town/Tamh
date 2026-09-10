# TÀMH — 배포 설정

## 1. 환경변수

Vercel 프로젝트 `tamh-bar` → Settings → Environment Variables 에 아래 네 개를 넣습니다.
네 값 모두 Production / Preview / Development 에 등록하세요.

| 이름 | 값 |
|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sravsgmktgiyrkohvvwa.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys 의 `anon` 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | 같은 화면의 `service_role` 키 (절대 클라이언트에 노출 금지) |
| `ADMIN_PIN` | 매장에서 쓸 네 자리 숫자 |

`ADMIN_PIN`이 비어 있으면 관리자 API가 모든 요청을 거부합니다. 메뉴판은 읽기 전용으로만 뜹니다.
`NEXT_PUBLIC_SUPABASE_URL` 또는 `SUPABASE_SERVICE_ROLE_KEY`가 비어 있으면
`src/lib/static-db.ts`의 정적 데이터로 폴백합니다. 이 상태의 수정은 저장되지 않습니다.

로컬 개발은 `.env.example`을 `.env.local`로 복사해 같은 값을 채우면 됩니다.

## 2. 데이터베이스

Supabase 프로젝트 `tamh-bar` (`sravsgmktgiyrkohvvwa`, ap-northeast-2)에 이미 적용돼 있습니다.

- `categories` 16개, `menus` 235개 (칵테일 17, 푸드 5)
- RLS: `anon`은 SELECT만, 쓰기는 `service_role` (관리자 API Route)만
- Storage 버킷 `menu-images` — 공개 읽기, 8MB 상한, 이미지 MIME만 허용

같은 스키마를 새 프로젝트에 다시 만들 때는 `supabase/data.sql` 하나를 SQL Editor에서 실행하면 됩니다.

## 3. 메뉴 수정 방법

메뉴판(`/menu`) 우측 상단 자물쇠를 누르고 PIN을 입력하면 관리자 모드가 켜집니다.

**칵테일 · 푸드** — 카드를 누르면 수정 창이 열립니다.
사진, 이름, 가격, 도수, 설명을 한 창에서 고치고 저장합니다.
카드 아래 `품절 표시` 버튼은 한 번 누르면 바로 반영됩니다.

**위스키** — 잔 가격은 숫자를 눌러 그 자리에서 고칩니다.
병 버튼으로 병 가격을, 점 세 개 버튼으로 수정과 삭제를 합니다.

**사진** — 수정 창의 `사진 올리기`로 iPad에서 찍은 사진을 그대로 올립니다.
Supabase Storage에 저장되고 공개 URL이 메뉴에 연결됩니다.
다른 사이트 이미지를 쓰려면 `주소 입력`으로 URL을 붙여넣습니다.

## 4. 하드코딩된 예비 데이터

`src/lib/cocktail-data.ts`와 `src/lib/food-data.ts`는 DB 값이 비어 있을 때만 쓰이는 예비값입니다.
DB의 `image_url`, `description`, `abv`가 채워져 있으면 그쪽이 우선합니다.
관리자 화면에서 고친 값이 항상 이깁니다.
