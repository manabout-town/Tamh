# AI-Team 설계 문서
**날짜:** 2026-06-24  
**프로젝트:** AI-Team — 생산성 200x AX 조직 시뮬레이터  
**위치:** `/Users/park/Desktop/ai-team/`

---

## 개요

사용자가 내린 지시를 CEO, CTO, CFO, CMO, CSO, CDO 6명의 AI 에이전트가 카카오톡 단톡방 스타일 UI에서 사람처럼 대화하며 협업 처리하는 Next.js 웹앱. PWA로 바탕화면에 설치 가능.

---

## 1. 기술 스택

| 레이어 | 기술 |
|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS + Framer Motion |
| Backend | Next.js API Routes + Server-Sent Events (SSE) |
| AI (에이전트) | Anthropic SDK — claude-sonnet-4-6 |
| AI (분류기) | claude-haiku-4-5 (저비용 pre-classifier) |
| CLI 브릿지 | Node.js child_process.spawn → claude CLI (CTO 전용) |
| 스토리지 | 로컬 JSON 파일 (대화기록, 스킬) |
| PWA | next-pwa |

---

## 2. 아키텍처

```
/Users/park/Desktop/ai-team/
├── app/
│   ├── manifest.ts               # PWA 설정
│   ├── page.tsx                  # 채팅 메인 UI
│   ├── skills/page.tsx           # 스킬 관리 페이지
│   └── api/
│       ├── chat/route.ts         # 오케스트레이터 실행
│       ├── stream/route.ts       # SSE 스트리밍
│       └── classify/route.ts     # 모드 자동 감지
├── lib/
│   ├── orchestrator.ts           # 에이전트 실행 순서/모드 관리
│   ├── classifier.ts             # Full/Lead/Direct 판단
│   ├── cli-bridge.ts             # Claude Code CLI subprocess (CTO 전용)
│   ├── skills-loader.ts          # 에이전트 스킬 컨텍스트 주입
│   └── agents/
│       ├── ceo.ts
│       ├── cto.ts                # CLI subprocess 권한 보유
│       ├── cfo.ts
│       ├── cmo.ts
│       ├── cso.ts
│       └── cdo.ts
└── data/
    ├── conversations.json
    └── skills/
        ├── base/                 # 기본 탑재 스킬 (역할 정의 + 도메인 지식)
        │   ├── ceo.md
        │   ├── cto.md
        │   ├── cfo.md
        │   ├── cmo.md
        │   ├── cso.md
        │   └── cdo.md
        └── custom/               # 유저가 추가한 스킬/지식
```

---

## 3. 에이전트 역할 및 도메인

| 에이전트 | 색상 | 이모지 | 담당 도메인 | 최종 보고 트리거 |
|---|---|---|---|---|
| CEO | 골드 | 👔 | 전략, 최종 의사결정, 우선순위 | 모든 태스크 종합 보고 |
| CTO | 블루 | 💻 | 코드, 아키텍처, 버그, 기술 구현 | 코드 완성, 버그 패치 |
| CFO | 그린 | 💰 | 비용, 예산, ROI, API 사용량 | 재무 리포트, 비용 분석 |
| CMO | 핑크 | 📣 | 마케팅, UX, 사용자 경험 | 캠페인, UX 결정 |
| CSO | 퍼플 | 📊 | 전략 기획, 로드맵, 경쟁 분석 | 전략 문서 |
| CDO | 오렌지 | 📈 | 데이터, 분석, 지표, AI 모델 | 데이터 분석 결과 |

**보고 구조:** 모든 에이전트 → CEO → 유저 컨펌  
CEO는 에이전트들의 구조화된 요약만 수신 (전체 출력 X → 토큰 절감)

---

## 4. 오케스트레이션 로직

### 4.1 시작 플로우
```
앱 실행
→ CEO: "안녕하세요 박효균님, 오늘 어떤 업무 진행할까요?"
→ 유저 입력
→ Pre-classifier 실행
→ UI 확인 요청
→ 유저 Yes / No / 직접입력
→ 오케스트레이터 실행
→ 에이전트 회의 (채팅방에 실시간 표시)
→ CEO 종합
→ 유저 최종 컨펌
→ 실행
```

### 4.2 3단계 모드 시스템

| 모드 | 사용 시점 | 활성 에이전트 | 예상 토큰 |
|---|---|---|---|
| **Direct** | 단순 조회, 빠른 답변 | CEO만 | ~3,100 |
| **Lead** | 단일 도메인 명확한 태스크 | 주도 1명 + CEO | ~4,400 |
| **Full** | 다중 도메인, 중요 전략 태스크 | 관련 전원 + CEO | ~8,800~13,200 |

### 4.3 Pre-classifier 출력 형식
```json
{
  "mode": "Full",
  "agents": ["CSO", "CMO", "CFO"],
  "lead": "CMO",
  "reason": "마케팅 비용 최적화 — 전략+마케팅+재무 교차 도메인",
  "confidence": 0.89
}
```

### 4.4 유저 확인 UI
- **Yes** — 제안대로 실행
- **No** — 시스템 재분류
- **직접입력** — 유저가 텍스트로 수정 지시

### 4.5 에이전트 간 통신
에이전트 → CEO 보고 시 구조화된 요약만 전달:
```json
{
  "role": "CTO",
  "status": "완료",
  "result": "버그 패치 완료",
  "detail": "line 42 null check 추가"
}
```

### 4.6 안전장치
- 에이전트 턴 최대 10회 제한 (태스크당, 무한루프 방지)
- 컨텍스트 최근 20개 메시지만 API 호출에 전달, 이전은 압축 요약
- API 타임아웃 → CEO가 재시도 메시지 출력
- "No" 재분류 최대 3회 → 3회 초과 시 CEO가 유저에게 직접 질문으로 전환

---

## 5. CTO CLI 브릿지 (A+B 혼합)

- 채팅/토론/계획 → Anthropic API (구조 A)
- 실제 코드 작성/실행 → Claude Code CLI subprocess (구조 B)
- CTO 에이전트만 CLI 접근 권한 보유
- CLI 출력 파싱 후 말풍선으로 채팅창에 표시

```
CTO 에이전트 판단: "코드 실행 필요"
→ child_process.spawn('claude', [...args])
→ stdout 스트리밍 → SSE → 채팅창 인라인 코드블록
```

---

## 6. 스킬 시스템

### 6.1 스킬 주입
```
에이전트 시스템 프롬프트 = 역할 정의 + base 스킬 + custom 스킬
```

### 6.2 스킬 추가 UI (`/skills`)
- 텍스트 직접 입력 or `.md` 파일 업로드
- 적용 에이전트 선택 (멀티 선택 가능)
- 즉시 적용 (다음 대화부터 반영)
- 스킬 목록 조회 + 삭제

---

## 7. UI/UX

### 7.1 레이아웃
```
┌─────────────────────────────────────┐
│  AI-TEAM   ● Full   [스킬] [설정]   │  ← 헤더 (모드 뱃지)
├──────────┬──────────────────────────┤
│ CEO  👔  │                          │
│ CTO  💻  │   [채팅 메인 영역]        │
│ CFO  💰  │   에이전트 말풍선         │
│ CMO  📣  │   (왼쪽, 타인 스타일)    │
│ CSO  📊  │                          │
│ CDO  📈  │   유저 말풍선             │
│          │   (오른쪽)               │
│ ● 활성   │                          │
│ ○ 대기   │                          │
│ — 완료   │                          │
├──────────┴──────────────────────────┤
│  [Yes]  [No]  [직접입력_________]  │  ← 컨펌바 (CEO 종합 시만 표시)
├─────────────────────────────────────┤
│  메시지 입력...             [전송]  │
└─────────────────────────────────────┘
```

### 7.2 에이전트 말투
- AI 말투 지양, 사람 말투 지향
- 예: "분석 완료했습니다" X → "저는 이렇게 보는데요" O
- 각 에이전트 개성 있는 어투 (CEO: 결단력, CTO: 논리적, CMO: 감성적 등)

### 7.3 상태 표시
- 타이핑 중: `...` 애니메이션
- CTO 코드 실행 중: 터미널 아이콘 + 로딩
- 좌측 사이드바: 에이전트별 활성/대기/완료 상태

---

## 8. PWA 설정

- `app/manifest.ts` — 앱 이름, 아이콘, standalone 모드
- 독립 창으로 실행 (브라우저 UI 없음)
- 바탕화면/독 아이콘 설치
- 오프라인 지원: 대화기록 캐시, AI 요청은 온라인 필요

---

## 9. 토큰 비용 비교

| 사용 방식 | 턴당 토큰 | 턴당 비용 (sonnet) |
|---|---|---|
| Claude Code 직접 | ~2,500 | ~$0.014 |
| AI-Team Direct | ~3,100 | ~$0.015 |
| AI-Team Lead | ~4,400 | ~$0.022 |
| AI-Team Full (전원) | ~13,200 | ~$0.050 |

평균: Direct/Lead 기본 사용 시 **약 1.5-2배** 수준.  
Full 모드 = 6명 전문가 동시 검토 가치.

---

## 10. 미결 사항

없음. 모든 설계 결정 완료.
