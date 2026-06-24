# 채팅 앱 설계 문서

**작성일:** 2026-06-24  
**상태:** Phase 1 개발 준비 완료  
**스택:** Expo (React Native) + Supabase + RevenueCat + AdMob

---

## 1. 앱 개요

게시판을 매개로 낯선 사람과 연결되는 소셜 채팅 앱. 유저가 게시글을 올리면 다른 유저가 쪽지를 보내고, 상대방이 답장하면 채팅이 개통되는 구조. 소개팅·고민상담·동네 친구 찾기를 하나의 피드에서 해결한다.

**핵심 UX 루프:**
```
게시글 작성 → 다른 유저가 쪽지 발송 (90p 차감) → 답장 시 채팅 개통
```

---

## 2. 타겟 유저

| 구분 | 상세 |
|------|------|
| 주 타겟 | 20~30대 |
| 보조 타겟 | 10~20대 |
| 특징 | 새로운 만남을 원하지만 기존 소개팅 앱이 불편한 유저 |

---

## 3. 신원 정책

- **공개 정보:** 성별, 나이 (필수 공개)
- **식별자:** 닉네임
- **비공개:** 실명, 연락처
- **가입 인증:** SMS 인증 필수
- **성인 기능:** 성인 인증 후 이성 필터 등 추가 기능 해금 (Phase 2)

---

## 4. 앱 구조

### 바텀 탭 네비게이션

```
[게시판]  [채팅함]  [알림]  [마이페이지]
```

### 게시판 화면

```
┌─────────────────────────────────┐
│  [전체] [주변] [이성*] [최근접속]  ← 필터 칩 (* Phase 2)
├─────────────────────────────────┤
│  닉네임 / 성별 / 나이              │
│  본문 미리보기 + 사진 썸네일        │
│  [쪽지 보내기 90p]                │
├─────────────────────────────────┤
│  ...                             │
└─────────────────────────────────┘
              [+ 글쓰기]  ← FAB
```

### 쪽지 → 채팅 흐름

1. 상대 글에서 "쪽지 보내기 (90p)" 탭
2. 잔액 확인 → 90p 차감 → 메시지 입력 → 전송
3. 상대가 답장 → 양방향 채팅 개통
4. 무응답 보호 로직: 추후 결정

### 마이페이지

- 프로필 사진 편집
- 닉네임 변경
- 휴대폰 번호 변경
- 포인트 잔액 확인 및 충전
- 설정 (알림, 차단 목록, 신고 내역)

---

## 5. 위치 기능

| 모드 | 설명 | Phase |
|------|------|-------|
| 동네 설정 | 구/동 단위 직접 설정, GPS 불필요 | Phase 1 |
| GPS 실시간 | 현재 위치 기준 반경 필터 | Phase 2 |

---

## 6. 데이터 모델

### users
```sql
id              uuid PRIMARY KEY
nickname        text NOT NULL UNIQUE
gender          text NOT NULL          -- 'M' | 'F'
birth_date      date NOT NULL
phone           text NOT NULL UNIQUE
profile_photos  text[]
points_balance  integer DEFAULT 0
last_active_at  timestamptz
is_adult_verified boolean DEFAULT false
region          text                   -- 동네 설정값
created_at      timestamptz DEFAULT now()
```

### posts
```sql
id              uuid PRIMARY KEY
user_id         uuid REFERENCES users
content         text NOT NULL
images          text[]
category        text                   -- '일상' | '고민' | '만남'
location_region text
location_lat    float8
location_lng    float8
created_at      timestamptz DEFAULT now()
```

### conversations
```sql
id              uuid PRIMARY KEY
sender_id       uuid REFERENCES users
receiver_id     uuid REFERENCES users
post_id         uuid REFERENCES posts  -- 쪽지를 보낸 출처 게시글
status          text DEFAULT 'pending' -- 'pending' | 'active'
created_at      timestamptz DEFAULT now()
```

### messages
```sql
id               uuid PRIMARY KEY
conversation_id  uuid REFERENCES conversations
sender_id        uuid REFERENCES users
content          text NOT NULL
read_at          timestamptz
created_at       timestamptz DEFAULT now()
```

### point_transactions
```sql
id            uuid PRIMARY KEY
user_id       uuid REFERENCES users
amount        integer NOT NULL          -- 양수: 지급, 음수: 차감
type          text NOT NULL             -- 'daily_grant' | 'purchase' | 'send_message' | 'refund'
reference_id  uuid                      -- conversation_id 또는 결제 ID
created_at    timestamptz DEFAULT now()
```

---

## 7. 수익화 모델

### 포인트 시스템

| 항목 | 내용 |
|------|------|
| 기본 지급 | 일 100p (매일 00:00 자동 지급) |
| 쪽지 발송 비용 | 90p / 건 |
| 포인트 단위 | 1p = 1원 |

### 코인 충전 패키지

| 패키지 | 정가 | 실수령(수수료 30% 차감) |
|--------|------|----------------------|
| 1,000p | ₩1,000 | ₩700 |
| 5,500p (+10%) | ₩5,000 | ₩3,500 |
| 12,000p (+20%) | ₩10,000 | ₩7,000 |

### 광고 수익 (Phase 2)

- AdMob 배너/네이티브 광고 게시판 피드에 삽입

---

## 8. 기술 스택

| 레이어 | 기술 | 용도 |
|--------|------|------|
| 앱 | Expo (React Native) | iOS + Android 크로스플랫폼 |
| 백엔드/DB | Supabase (PostgreSQL) | 데이터 저장, RLS 보안 |
| 실시간 채팅 | Supabase Realtime | 별도 소켓 서버 불필요 |
| 인증 | Supabase Auth (Phone) | SMS 인증 (Twilio 내장) |
| 이미지 저장 | Supabase Storage | 게시글·프로필 사진 |
| 인앱 결제 | RevenueCat | iOS/Android IAP 통합 처리 |
| 광고 | AdMob (Phase 2) | 배너/네이티브 광고 |
| 빌드/배포 | Expo EAS Build | 스토어 제출 자동화 |

---

## 9. 안전 장치

| 기능 | Phase |
|------|-------|
| SMS 인증 가입 | Phase 1 |
| 신고 시스템 | Phase 1 |
| 유저 차단 | Phase 1 |
| 성인 인증 (이성 필터 해금) | Phase 2 |

---

## 10. 출시 로드맵

### Phase 1 (목표: 2~3개월)

- [ ] Expo 프로젝트 초기 세팅
- [ ] Supabase 스키마 구성 + RLS 정책
- [ ] SMS 인증 가입/로그인
- [ ] 게시판 CRUD (텍스트 + 사진)
- [ ] 필터 (전체/주변/최근접속)
- [ ] 쪽지 발송 (90p 차감) + 채팅
- [ ] Supabase Realtime 채팅
- [ ] 일 100p 자동 지급 (Supabase cron)
- [ ] RevenueCat IAP 코인 충전
- [ ] 신고/차단
- [ ] EAS Build → App Store + Google Play 제출

### Phase 2 (출시 후 1~2개월)

- [ ] GPS 실시간 위치 필터
- [ ] 성인 인증 + 이성 필터 해금
- [ ] AdMob 광고 삽입
- [ ] 마케팅 드라이브 (메타 앱 설치 광고)
- [ ] 무응답 보호 로직 결정 및 구현

---

## 11. 마케팅 전략

### 출시 전

- 인스타그램 계정 선개설
- 빌드인퍼블릭 숏폼 콘텐츠 (개발 과정 공유)
- D-7 베타 테스터 모집

### Phase 1 출시 직후

| 채널 | 방법 |
|------|------|
| 커뮤니티 | 에브리타임, 블라인드, 오픈카톡방 자연 노출 |
| 숏폼 | 틱톡/인스타 릴스 — 사용 사례 30초 영상 |
| 리퍼럴 | 친구 초대 시 양측 200p 지급 |

### Phase 2

- 메타 앱 설치 광고 (20~30대 타겟)
- AdMob 수익으로 광고비 일부 상쇄

### 핵심 KPI

| 지표 | 목표 |
|------|------|
| Day 1 리텐션 | > 40% |
| Day 7 리텐션 | > 20% |
| 쪽지 전환율 (글 조회 → 쪽지) | > 5% |
| 월 결제 유저 비율 | > 3% |
