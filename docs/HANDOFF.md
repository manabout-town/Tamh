# TÀMH 메뉴판 — 인수인계

다른 세션에서 이 작업을 이어받을 때 이 문서만 읽으면 됩니다.
2026-09-11 기준. 작업 브랜치는 `claude/tamh-menu-work-ro52g8`.

---

## 0. 한 줄 요약

칵테일 수정 기능과 Supabase 전환은 코드로 끝났고 푸시돼 있습니다.
칵테일 사진 15종도 2026-09-11 에 생성해서 넣고 DB까지 연결했습니다.
**남은 일은 하나입니다. Vercel 환경변수 등록.**

---

## 1. 프로젝트 좌표

| 항목 | 값 |
|------|-----|
| 레포 | `manabout-town/Tamh` |
| 작업 브랜치 | `claude/tamh-menu-work-ro52g8` |
| 라이브 | https://tamh-bar.vercel.app/menu |
| Vercel 프로젝트 | `tamh-bar` (팀 `manabouttowns-projects`) |
| Supabase 프로젝트 | `tamh-bar` / ref `sravsgmktgiyrkohvvwa` / ap-northeast-2 |
| 스택 | Next.js 14 App Router · TypeScript · Tailwind · Supabase |
| 타겟 | iPad 가로모드 |

Vercel 프로젝트에 깃 연동이 걸려 있지 않습니다. 배포는 레포 루트의 `deploy.sh`로 합니다.

---

## 2. 무엇이 왜 막혀 있었나

칵테일 수정이 안 된 이유는 세 겹이었고 모두 고쳤습니다.

1. **칵테일 탭에 수정 수단이 없었음.** `CleanMenuBoard.tsx`가 위스키는 `CleanMenuRow`에
   `adminMode`와 편집 콜백을 넘기면서, 칵테일·푸드를 그리는 `MenuCardGrid`에는
   아무 props도 넘기지 않았습니다.
2. **고쳐도 화면에 안 나왔음.** 카드의 설명과 도수를 `cocktail-data.ts`의 하드코딩 표에서만
   읽어서 DB의 `description`이 무시됐습니다.
3. **저장이 안 남았음.** 관리자 API가 Supabase가 아니라 `static-db.ts`의 메모리 배열에 썼습니다.
   서버리스라 콜드 스타트마다 초기화됐습니다.

---

## 3. 끝난 일

커밋 네 개. 모두 `origin/claude/tamh-menu-work-ro52g8`에 푸시됨.

| 커밋 | 내용 |
|------|------|
| `c42b676` | 칵테일·푸드 카드 편집 + 저장소 Supabase 전환 |
| `16f353a` | 배포 설정 문서 (`docs/SETUP.md`) |
| `ab819df` | 커피앤시가렛 실사진 교체 |
| `15641cd` | 칵테일 15종 사진 프롬프트 (`docs/cocktail-image-prompts.md`) |

### 3.1 코드

**새 파일**
- `src/lib/menu-store.ts` — 서버 전용 데이터 계층. Supabase 환경변수가 있으면 Supabase,
  없으면 `static-db.ts`로 폴백. 쓰기는 `menus` 테이블에 실제로 있는 컬럼만 통과시킵니다.
  `uploadMenuImage()`로 Storage 업로드도 여기서 처리합니다.
- `src/lib/admin-auth.ts` — `ADMIN_PIN`이 비어 있으면 모든 관리자 요청 거부.
- `src/app/api/admin/upload/route.ts` — 사진 업로드. 8MB 상한, 이미지 MIME만.

**고친 파일**
- `src/components/menu/MenuCardGrid.tsx` — 관리자 모드에서 카드를 누르면 수정 창이 열립니다.
  카드마다 한 번 눌러 바로 적용되는 품절 토글 버튼. 설명·도수·사진을 DB에서 먼저 읽습니다.
  임의 호스트 주소도 뜨도록 `next/image` 대신 `img` 사용.
- `src/components/menu/MenuFormModal.tsx` — 카테고리 그룹에 따라 입력란이 달라집니다.
  칵테일·푸드는 사진이 맨 위, 도수가 가격 옆, 병 가격은 숨김.
  사진 업로드 · 주소 직접 입력 · 품절 스위치 · 삭제를 한 창에서 처리.
- `src/components/menu/CleanMenuBoard.tsx` — `MenuCardGrid`에 관리자 props 전달.
  메뉴 추가 시 지금 보고 있는 카테고리를 미리 선택.
- API 라우트 4개와 `menu/page.tsx`, `soldout/page.tsx` — 전부 `menu-store`를 지나갑니다.
- `src/lib/admin-api.ts` — `adminUploadImage()` 추가.

### 3.2 검증한 것

정적 폴백 모드에서 `next build` 후 Playwright로 확인했습니다.

- 관리자 PIN 해제 → 칵테일 탭에 연필 배지 17개, 품절 버튼 17개 렌더
- 커피앤시가렛 카드 → 수정 창 열림 → 가격 21000, 도수 22, 설명 변경 → 저장
- `/api/menus` 응답과 카드 모두 반영 확인
- 품절 토글 → `is_active=false` 반영 확인

**검증 못 한 것: 실제 Supabase에 붙은 상태.** 이 클라우드 세션의 네트워크 정책이
`supabase.co` 접속을 막아서 왕복 확인을 못 했습니다. 컴퓨터에서는 됩니다.

### 3.3 Supabase (이미 적용 완료)

- `categories` 16개, `menus` 235개 (칵테일 17, 푸드 5, 사진 있는 항목 22)
- RLS: `anon`은 SELECT만, 쓰기는 `service_role`만
- Storage 버킷 `menu-images` — 공개 읽기, 8MB 상한
- 커피앤시가렛의 `image_url`은 `/menu/coffee-and-cigarettes.jpg`로 이미 바꿔둠

> 주의: `supabase/data.sql`을 다시 통째로 실행하면 메뉴가 중복 삽입되고
> 커피앤시가렛 경로도 원래대로 돌아갑니다. 재적재는 필요할 때만 하세요.

---

## 4. 남은 일 ①: Vercel 환경변수 (제일 급함)

**이게 없으면 지금 배포된 사이트는 여전히 정적 데이터를 쓰고 수정이 저장되지 않습니다.**

Vercel → `tamh-bar` → Settings → Environment Variables.
Production / Preview / Development 세 곳 모두에 넣으세요.

```
NEXT_PUBLIC_SUPABASE_URL       = https://sravsgmktgiyrkohvvwa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = Supabase → Project Settings → API Keys 의 anon 키
SUPABASE_SERVICE_ROLE_KEY      = 같은 화면의 service_role 키
ADMIN_PIN                      = 매장에서 쓸 네 자리 숫자
```

넣은 뒤 재배포하고 확인할 것:

1. `/menu`가 뜨고 메뉴 235종이 보이는지
2. 자물쇠 → PIN → 칵테일 카드 누르면 수정 창이 열리는지
3. 가격을 바꿔 저장하고 **새로고침해도 유지되는지** (이게 핵심)
4. 다른 기기에서 열었을 때도 같은 값인지

---

## 5. 끝난 일 ②: 칵테일 사진 15종 (2026-09-11 완료)

15종 모두 Gemini(Nano Banana 2)로 생성해 `public/menu/` 에 넣고, Supabase
`menus.image_url` 과 정적 폴백(`static-db.ts`, `cocktail-data.ts`)을 모두
`/menu/<slug>.jpg` 로 맞췄습니다. 커밋 `bd5af39`.

| 메뉴 | 파일 |
|------|------|
| 갓파더 | `/menu/godfather.jpg` |
| 체리 올드패션드 | `/menu/cherry-old-fashioned.jpg` |
| 와일드 플라워 쥴렙 | `/menu/wild-flower-julep.jpg` |
| 버진 베리 모히또 | `/menu/virgin-berry-mojito.jpg` |
| 버진 라임 모히또 | `/menu/virgin-lime-mojito.jpg` |
| 진토닉 | `/menu/gin-tonic.jpg` |
| 진피즈 | `/menu/gin-fizz.jpg` |
| 진리키 | `/menu/gin-rickey.jpg` |
| 다이키리 | `/menu/daiquiri.jpg` |
| 콜드브루 마티니 | `/menu/cold-brew-martini.jpg` |
| 두유하이 | `/menu/soy-milk-high.jpg` |
| 라프로익 패션드 | `/menu/laphroaig-fashioned.jpg` |
| 라프로익 페니실린 | `/menu/laphroaig-penicillin.jpg` |
| 비터진 | `/menu/bitter-gin.jpg` |
| 파우스트 | `/menu/faust.jpg` |

커피앤시가렛은 매장 실사진, 불오름은 기존 사진 그대로입니다.

생성물 우하단에 Gemini 워터마크가 들어가므로, 원본 1024 정사각형에서 우·하단 15%를
뺀 영역을 잘라 1200x1200 으로 리사이즈했습니다. 사진을 새로 추가할 때도 같은 처리가
필요합니다 (`scripts/fit_menu_image.py` 는 가운데 정사각형만 잡고 워터마크는 못 뺍니다).

### 아직 확인이 필요한 것

시그니처 5종(두유하이, 라프로익 패션드, 라프로익 페니실린, 비터진, 파우스트)은 표준
형태가 없어 메뉴 설명에서 유추한 프롬프트로 만들었습니다. **실물과 다를 수 있으니
바텐더 확인을 받으세요.** 매장에서 직접 찍은 사진이 있으면 그쪽이 낫습니다.

교체하려면 사진을 같은 파일명으로 `public/menu/` 에 덮어쓰면 됩니다. DB 경로는
그대로 두면 됩니다.

참고로 예전 홈페이지 사진(`cdn.imweb.me`)은 이 컴퓨터에서 아직 열립니다. 생성 이미지
대신 그 실사진을 쓰기로 하면 내려받아 같은 파일명으로 덮어쓰면 됩니다.

## 6. 이 세션에서 막혔던 것 (반복하지 마세요)

이 클라우드 세션은 `Default - trusted network access` 네트워크 정책 아래 있었습니다.
아래가 전부 차단됐습니다. **개인 컴퓨터에서는 모두 정상입니다.**

- `gemini.google.com`, `aistudio.google.com` — 프록시가 403으로 연결 거부
- `supabase.co` — 같은 이유. 그래서 Storage 업로드와 왕복 테스트를 못 했습니다
- `cdn.imweb.me` — 기존 칵테일 사진을 내려받지 못했습니다

Supabase 관리 작업은 MCP의 관리용 SQL 실행으로 우회했습니다. 그건 잘 동작합니다.

---

## 7. 로컬에서 시작하기

```bash
git clone https://github.com/manabout-town/Tamh.git
cd Tamh
git checkout claude/tamh-menu-work-ro52g8
npm install

cp .env.example .env.local   # 4절의 값 채우기
npm run dev                  # http://localhost:3000/menu
```

타입 검사는 `npm run type-check`, 빌드는 `npm run build`.
ESLint 설정은 레포에 없어서 `npm run lint`는 초기 설정을 물어봅니다.

---

## 8. 다음 세션에 그대로 붙여넣을 프롬프트

```
Tamh 메뉴판 작업 이어서 할 거야. docs/HANDOFF.md 읽고 시작해.
브랜치는 claude/tamh-menu-work-ro52g8.
남은 건 Vercel 환경변수 등록이야 (4절). 넣고 재배포한 다음
수정이 저장되는지까지 확인해줘.
```
