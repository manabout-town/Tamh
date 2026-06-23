# AI-Team Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 6명의 AI 에이전트(CEO/CTO/CFO/CMO/CSO/CDO)가 카카오톡 단톡방 UI에서 사람처럼 협업하며 유저 지시를 처리하는 Next.js PWA 앱 구축

**Architecture:** Next.js 15 App Router + SSE 스트리밍. 유저 입력 → haiku pre-classifier → 모드/에이전트 결정 → 유저 확인 → 오케스트레이터가 에이전트 순차 실행 → CEO 종합 → 유저 최종 컨펌. 에이전트 간 공유 상태는 인메모리 EventEmitter로 관리. CTO만 Claude Code CLI subprocess 권한 보유.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Anthropic SDK, next-pwa, Jest + ts-jest

---

## 파일 구조 전체 맵

```
/Users/park/Desktop/ai-team/
├── app/
│   ├── layout.tsx                  # 루트 레이아웃 + PWA 메타
│   ├── page.tsx                    # 채팅 메인 페이지
│   ├── manifest.ts                 # PWA manifest
│   ├── skills/
│   │   └── page.tsx               # 스킬 관리 페이지
│   └── api/
│       ├── classify/route.ts       # POST — 태스크 분류
│       ├── chat/route.ts           # POST — 대화 시작 (오케스트레이터 실행)
│       ├── stream/route.ts         # GET  — SSE 스트림
│       └── skills/
│           ├── route.ts            # GET(목록) POST(추가)
│           └── [id]/route.ts       # DELETE
├── lib/
│   ├── types.ts                    # 공유 타입 정의 (단일 source of truth)
│   ├── event-bus.ts                # 인메모리 EventEmitter + 세션 상태
│   ├── classifier.ts               # Pre-classifier 로직
│   ├── skills-loader.ts            # 스킬 파일 읽기 + 에이전트 프롬프트 주입
│   ├── context-manager.ts          # 대화 히스토리 관리 + 압축
│   ├── orchestrator.ts             # 에이전트 실행 순서/모드 조율
│   ├── cli-bridge.ts               # Claude Code CLI subprocess (CTO 전용)
│   └── agents/
│       ├── base-agent.ts           # 공통 에이전트 호출 로직
│       ├── ceo.ts
│       ├── cto.ts
│       ├── cfo.ts
│       ├── cmo.ts
│       ├── cso.ts
│       └── cdo.ts
├── components/
│   ├── chat/
│   │   ├── ChatRoom.tsx            # 채팅 전체 컨테이너
│   │   ├── MessageBubble.tsx       # 말풍선 (에이전트/유저)
│   │   ├── AgentSidebar.tsx        # 왼쪽 에이전트 상태 목록
│   │   ├── ConfirmBar.tsx          # Yes/No/직접입력 확인 UI
│   │   ├── InputBar.tsx            # 메시지 입력창
│   │   └── TypingIndicator.tsx     # 타이핑 ... 애니메이션
│   └── skills/
│       ├── SkillsList.tsx          # 스킬 목록 + 삭제
│       └── SkillUpload.tsx         # 스킬 추가 (텍스트/파일)
├── hooks/
│   ├── useSSE.ts                   # SSE 연결 관리
│   └── useChat.ts                  # 채팅 전체 상태 관리
├── data/
│   ├── conversations.json          # 대화 기록
│   └── skills/
│       ├── base/                   # 기본 에이전트 스킬 (개발 중 채움)
│       │   ├── ceo.md
│       │   ├── cto.md
│       │   ├── cfo.md
│       │   ├── cmo.md
│       │   ├── cso.md
│       │   └── cdo.md
│       └── custom/                 # 유저 추가 스킬
└── __tests__/
    ├── classifier.test.ts
    ├── orchestrator.test.ts
    ├── skills-loader.test.ts
    └── context-manager.test.ts
```

---

## Phase 1: 프로젝트 초기화

### Task 1: Next.js 프로젝트 생성 및 의존성 설치

**Files:**
- Create: `/Users/park/Desktop/ai-team/` (전체 프로젝트)

- [ ] **Step 1: Next.js 15 프로젝트 생성**

```bash
cd /Users/park/Desktop
npx create-next-app@latest ai-team \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=no \
  --import-alias="@/*"
cd ai-team
```

- [ ] **Step 2: 추가 의존성 설치**

```bash
npm install @anthropic-ai/sdk framer-motion next-pwa
npm install --save-dev jest ts-jest @types/jest jest-environment-jsdom
```

- [ ] **Step 3: Jest 설정 파일 생성**

`jest.config.ts` 생성:
```typescript
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
}

export default config
```

- [ ] **Step 4: 데이터 디렉토리 및 초기 파일 생성**

```bash
mkdir -p data/skills/base data/skills/custom __tests__ components/chat components/skills hooks lib/agents
echo '[]' > data/conversations.json
touch data/skills/base/ceo.md data/skills/base/cto.md data/skills/base/cfo.md
touch data/skills/base/cmo.md data/skills/base/cso.md data/skills/base/cdo.md
```

- [ ] **Step 5: .env.local 설정**

`.env.local` 생성:
```
ANTHROPIC_API_KEY=your_key_here
```

`.gitignore`에 추가 확인:
```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 6: 개발 서버 실행 확인**

```bash
npm run dev
```
Expected: `http://localhost:3000` 접속 시 Next.js 기본 페이지 표시

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with dependencies"
```

---

### Task 2: 공유 타입 정의

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: 타입 파일 작성**

`lib/types.ts`:
```typescript
export type AgentRole = 'CEO' | 'CTO' | 'CFO' | 'CMO' | 'CSO' | 'CDO'

export type OrchestratorMode = 'Direct' | 'Lead' | 'Full'

export type AgentStatus = 'idle' | 'active' | 'waiting' | 'done'

export type MessageRole = 'user' | 'agent' | 'system'

export interface AgentConfig {
  role: AgentRole
  color: string        // tailwind color class (e.g. 'amber-500')
  emoji: string
  domain: string[]     // 담당 도메인 키워드
}

export interface Message {
  id: string
  role: MessageRole
  agentRole?: AgentRole
  content: string
  timestamp: number
  isStreaming?: boolean
}

export interface AgentSummary {
  role: AgentRole
  status: 'completed' | 'error'
  result: string
  detail?: string
}

export interface ClassifierResult {
  mode: OrchestratorMode
  agents: AgentRole[]
  lead: AgentRole
  reason: string
  confidence: number
}

export interface SessionEvent {
  type: 'message_start' | 'message_delta' | 'message_end' | 'confirm_request' | 'error' | 'done'
  agentRole?: AgentRole
  content?: string
  classifierResult?: ClassifierResult
  error?: string
}

export interface Skill {
  id: string
  name: string
  content: string
  agents: AgentRole[]   // 적용 에이전트 (빈 배열 = 전체)
  isBase: boolean
  createdAt: number
}

export const AGENT_CONFIGS: Record<AgentRole, AgentConfig> = {
  CEO: { role: 'CEO', color: 'amber-500', emoji: '👔', domain: ['전략', '결정', '우선순위', '방향', '목표'] },
  CTO: { role: 'CTO', color: 'blue-500', emoji: '💻', domain: ['코드', '버그', '아키텍처', '기술', '개발', '배포'] },
  CFO: { role: 'CFO', color: 'green-500', emoji: '💰', domain: ['비용', '예산', 'ROI', '수익', '재무', '투자'] },
  CMO: { role: 'CMO', color: 'pink-500', emoji: '📣', domain: ['마케팅', 'UX', '사용자', '브랜드', '채널', '캠페인'] },
  CSO: { role: 'CSO', color: 'purple-500', emoji: '📊', domain: ['전략', '로드맵', '경쟁', '기획', '시장'] },
  CDO: { role: 'CDO', color: 'orange-500', emoji: '📈', domain: ['데이터', '분석', '지표', 'AI', '모델', '인사이트'] },
}
```

- [ ] **Step 2: 타입 컴파일 확인**

```bash
npx tsc --noEmit
```
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add lib/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

### Task 3: PWA 설정

**Files:**
- Create: `app/manifest.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: PWA manifest 작성**

`app/manifest.ts`:
```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI-Team',
    short_name: 'AI-Team',
    description: '6명의 AI 에이전트가 협업하는 AX 조직',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1a2e',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
```

- [ ] **Step 2: next.config.ts에 PWA 설정 추가**

`next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // PWA는 프로덕션 빌드에서만 활성화
}

export default nextConfig
```

> 참고: next-pwa는 `npm run build` 후 `npm start`로 실행 시 활성화. 개발 중엔 일반 Next.js로 동작.

- [ ] **Step 3: PWA 아이콘 placeholder 생성**

```bash
# public/ 디렉토리에 임시 아이콘 (개발 중 교체)
# 192x192, 512x512 PNG 필요 — 일단 빈 파일로
touch public/icon-192.png public/icon-512.png
```

- [ ] **Step 4: 커밋**

```bash
git add app/manifest.ts next.config.ts public/
git commit -m "feat: add PWA manifest configuration"
```

---

## Phase 2: 백엔드 코어

### Task 4: EventBus — 에이전트 이벤트 중계

**Files:**
- Create: `lib/event-bus.ts`

> 오케스트레이터(비동기)와 SSE 스트림(동기)을 연결하는 인메모리 버스. 로컬 단일 프로세스 환경에서 Redis 없이 실시간 이벤트 전달 가능.

- [ ] **Step 1: EventBus 작성**

`lib/event-bus.ts`:
```typescript
import { EventEmitter } from 'events'
import type { SessionEvent } from '@/lib/types'

class EventBus extends EventEmitter {}
export const eventBus = new EventBus()
eventBus.setMaxListeners(50)

export interface SessionState {
  id: string
  status: 'pending' | 'running' | 'waiting_confirm' | 'done' | 'error'
  events: SessionEvent[]
  createdAt: number
}

const sessions = new Map<string, SessionState>()

export function createSession(id: string): SessionState {
  const session: SessionState = {
    id,
    status: 'pending',
    events: [],
    createdAt: Date.now(),
  }
  sessions.set(id, session)
  return session
}

export function getSession(id: string): SessionState | undefined {
  return sessions.get(id)
}

export function emitEvent(sessionId: string, event: SessionEvent): void {
  const session = sessions.get(sessionId)
  if (session) {
    session.events.push(event)
    eventBus.emit(sessionId, event)
  }
}

export function updateSessionStatus(sessionId: string, status: SessionState['status']): void {
  const session = sessions.get(sessionId)
  if (session) session.status = status
}

// 1시간 후 세션 자동 정리
export function scheduleCleanup(sessionId: string): void {
  setTimeout(() => sessions.delete(sessionId), 60 * 60 * 1000)
}
```

- [ ] **Step 2: 커밋**

```bash
git add lib/event-bus.ts
git commit -m "feat: add in-memory event bus for session management"
```

---

### Task 5: Skills Loader

**Files:**
- Create: `lib/skills-loader.ts`
- Create: `__tests__/skills-loader.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`__tests__/skills-loader.test.ts`:
```typescript
import { loadSkillsForAgent, buildSystemPrompt } from '@/lib/skills-loader'
import * as fs from 'fs'
import * as path from 'path'

jest.mock('fs')
jest.mock('path')

describe('skills-loader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('loadSkillsForAgent', () => {
    it('base 스킬 파일을 읽어 반환한다', () => {
      const mockFs = fs as jest.Mocked<typeof fs>
      ;(mockFs.existsSync as jest.Mock).mockReturnValue(true)
      ;(mockFs.readFileSync as jest.Mock).mockReturnValue('## CTO 기술 원칙\n코드 품질 최우선')

      const result = loadSkillsForAgent('CTO')
      expect(result).toContain('CTO 기술 원칙')
    })

    it('파일이 없으면 빈 문자열 반환한다', () => {
      const mockFs = fs as jest.Mocked<typeof fs>
      ;(mockFs.existsSync as jest.Mock).mockReturnValue(false)

      const result = loadSkillsForAgent('CTO')
      expect(result).toBe('')
    })
  })

  describe('buildSystemPrompt', () => {
    it('역할 정의 + 스킬 내용을 조합한 프롬프트를 반환한다', () => {
      const mockFs = fs as jest.Mocked<typeof fs>
      ;(mockFs.existsSync as jest.Mock).mockReturnValue(true)
      ;(mockFs.readFileSync as jest.Mock).mockReturnValue('스킬 내용')

      const prompt = buildSystemPrompt('CTO')
      expect(prompt).toContain('CTO')
      expect(prompt).toContain('스킬 내용')
    })
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx jest __tests__/skills-loader.test.ts
```
Expected: FAIL — `loadSkillsForAgent` not found

- [ ] **Step 3: Skills Loader 구현**

`lib/skills-loader.ts`:
```typescript
import * as fs from 'fs'
import * as path from 'path'
import type { AgentRole } from '@/lib/types'

const DATA_DIR = path.join(process.cwd(), 'data', 'skills')

const ROLE_DEFINITIONS: Record<AgentRole, string> = {
  CEO: `당신은 AI-Team의 CEO입니다. 박효균님의 지시를 받아 팀을 이끌고 최종 의사결정을 합니다.
담당: 전략, 우선순위 결정, 팀 조율, 최종 보고.
말투: 결단력 있고 명확하게. 사람처럼 자연스럽게 대화합니다.`,

  CTO: `당신은 AI-Team의 CTO입니다. 기술적 판단과 코드 실행을 담당합니다.
담당: 코드 작성, 버그 수정, 아키텍처 설계, 기술 의사결정.
말투: 논리적이고 정확하게. 기술적 내용은 명확히 설명합니다.`,

  CFO: `당신은 AI-Team의 CFO입니다. 비용과 재무적 관점을 담당합니다.
담당: 비용 분석, 예산 관리, ROI 계산, API 비용 최적화.
말투: 수치 기반으로 명확하게. 실용적인 관점을 제시합니다.`,

  CMO: `당신은 AI-Team의 CMO입니다. 마케팅과 사용자 경험을 담당합니다.
담당: 마케팅 전략, UX 개선, 사용자 획득, 브랜드 포지셔닝.
말투: 사용자 관점으로 공감하며 대화합니다.`,

  CSO: `당신은 AI-Team의 CSO입니다. 전략 기획과 로드맵을 담당합니다.
담당: 장기 전략, 로드맵 설계, 경쟁 분석, 시장 기회 발굴.
말투: 큰 그림을 보며 체계적으로 설명합니다.`,

  CDO: `당신은 AI-Team의 CDO입니다. 데이터와 분석을 담당합니다.
담당: 데이터 분석, 지표 관리, AI 모델, 인사이트 도출.
말투: 데이터 기반으로 객관적으로 설명합니다.`,
}

export function loadSkillsForAgent(role: AgentRole): string {
  const parts: string[] = []

  const basePath = path.join(DATA_DIR, 'base', `${role.toLowerCase()}.md`)
  if (fs.existsSync(basePath)) {
    parts.push(fs.readFileSync(basePath, 'utf-8'))
  }

  const customDir = path.join(DATA_DIR, 'custom')
  if (fs.existsSync(customDir)) {
    const files = fs.readdirSync(customDir).filter(f => f.endsWith('.json'))
    for (const file of files) {
      try {
        const skill = JSON.parse(fs.readFileSync(path.join(customDir, file), 'utf-8'))
        if (!skill.agents?.length || skill.agents.includes(role)) {
          parts.push(skill.content)
        }
      } catch {
        // 손상된 스킬 파일 무시
      }
    }
  }

  return parts.join('\n\n---\n\n')
}

export function buildSystemPrompt(role: AgentRole): string {
  const roleDefinition = ROLE_DEFINITIONS[role]
  const skills = loadSkillsForAgent(role)

  const parts = [
    roleDefinition,
    '## 중요 규칙',
    '- AI처럼 말하지 마세요. 실제 직장인처럼 자연스럽게 대화하세요.',
    '- "안녕하세요! 저는 AI입니다" 같은 말은 절대 하지 마세요.',
    '- 의견이 다를 때는 솔직하게 말하세요.',
    '- 불필요한 서론 없이 핵심을 먼저 말하세요.',
  ]

  if (skills) {
    parts.push('## 보유 스킬 및 지식')
    parts.push(skills)
  }

  return parts.join('\n\n')
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx jest __tests__/skills-loader.test.ts
```
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add lib/skills-loader.ts __tests__/skills-loader.test.ts
git commit -m "feat: add skills loader with agent system prompt builder"
```

---

### Task 6: Context Manager — 대화 히스토리 관리

**Files:**
- Create: `lib/context-manager.ts`
- Create: `__tests__/context-manager.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`__tests__/context-manager.test.ts`:
```typescript
import { ContextManager } from '@/lib/context-manager'

describe('ContextManager', () => {
  let cm: ContextManager

  beforeEach(() => {
    cm = new ContextManager(5) // maxMessages=5로 테스트
  })

  it('메시지를 추가하고 반환한다', () => {
    cm.addMessage({ role: 'user', content: '안녕' })
    const messages = cm.getMessages()
    expect(messages).toHaveLength(1)
    expect(messages[0].content).toBe('안녕')
  })

  it('maxMessages 초과 시 오래된 메시지를 제거한다', () => {
    for (let i = 0; i < 7; i++) {
      cm.addMessage({ role: 'user', content: `메시지 ${i}` })
    }
    const messages = cm.getMessages()
    expect(messages.length).toBeLessThanOrEqual(5)
    expect(messages[messages.length - 1].content).toBe('메시지 6')
  })

  it('에이전트 요약을 구조화된 형식으로 추가한다', () => {
    cm.addAgentSummary({ role: 'CTO', status: 'completed', result: '완료', detail: '상세' })
    const messages = cm.getMessages()
    expect(messages[0].content).toContain('CTO')
    expect(messages[0].content).toContain('완료')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx jest __tests__/context-manager.test.ts
```
Expected: FAIL

- [ ] **Step 3: Context Manager 구현**

`lib/context-manager.ts`:
```typescript
import type { AgentSummary } from '@/lib/types'

interface ContextMessage {
  role: 'user' | 'assistant'
  content: string
}

export class ContextManager {
  private messages: ContextMessage[] = []
  private readonly maxMessages: number

  constructor(maxMessages = 20) {
    this.maxMessages = maxMessages
  }

  addMessage(message: ContextMessage): void {
    this.messages.push(message)
    if (this.messages.length > this.maxMessages) {
      // 오래된 메시지 제거 (가장 앞부터)
      this.messages = this.messages.slice(-this.maxMessages)
    }
  }

  addAgentSummary(summary: AgentSummary): void {
    const content = `[${summary.role}] ${summary.result}${summary.detail ? ` (${summary.detail})` : ''}`
    this.addMessage({ role: 'assistant', content })
  }

  getMessages(): ContextMessage[] {
    return [...this.messages]
  }

  getMessagesForAPI(): ContextMessage[] {
    // API 호출용 — role 연속 중복 방지 (Anthropic API 제약)
    const result: ContextMessage[] = []
    for (const msg of this.messages) {
      const last = result[result.length - 1]
      if (last && last.role === msg.role) {
        last.content += '\n' + msg.content
      } else {
        result.push({ ...msg })
      }
    }
    return result
  }

  clear(): void {
    this.messages = []
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx jest __tests__/context-manager.test.ts
```
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add lib/context-manager.ts __tests__/context-manager.test.ts
git commit -m "feat: add context manager for conversation history"
```

---

### Task 7: Pre-Classifier

**Files:**
- Create: `lib/classifier.ts`
- Create: `__tests__/classifier.test.ts`
- Create: `app/api/classify/route.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`__tests__/classifier.test.ts`:
```typescript
import { parseClassifierResponse } from '@/lib/classifier'

describe('parseClassifierResponse', () => {
  it('유효한 JSON을 파싱한다', () => {
    const raw = JSON.stringify({
      mode: 'Full',
      agents: ['CTO', 'CFO'],
      lead: 'CTO',
      reason: '기술+비용 교차',
      confidence: 0.9,
    })
    const result = parseClassifierResponse(raw)
    expect(result.mode).toBe('Full')
    expect(result.agents).toContain('CTO')
    expect(result.lead).toBe('CTO')
  })

  it('JSON 파싱 실패 시 Direct 모드로 폴백한다', () => {
    const result = parseClassifierResponse('invalid json')
    expect(result.mode).toBe('Direct')
    expect(result.lead).toBe('CEO')
  })

  it('잘못된 mode 값은 Direct로 폴백한다', () => {
    const raw = JSON.stringify({ mode: 'INVALID', agents: [], lead: 'CEO', reason: '', confidence: 0 })
    const result = parseClassifierResponse(raw)
    expect(result.mode).toBe('Direct')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx jest __tests__/classifier.test.ts
```
Expected: FAIL

- [ ] **Step 3: Classifier 구현**

`lib/classifier.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { ClassifierResult, OrchestratorMode, AgentRole } from '@/lib/types'

const VALID_MODES: OrchestratorMode[] = ['Direct', 'Lead', 'Full']
const VALID_ROLES: AgentRole[] = ['CEO', 'CTO', 'CFO', 'CMO', 'CSO', 'CDO']

const CLASSIFIER_PROMPT = `당신은 태스크 분류기입니다. 유저의 요청을 분석해 아래 JSON 형식으로만 응답하세요.

모드 선택 기준:
- Direct: 단순 질문, 빠른 답변, 정보 조회
- Lead: 한 분야가 명확한 태스크 (코드 버그 → CTO, 비용 분석 → CFO 등)
- Full: 다중 분야 교차, 중요 전략 결정, 복잡한 기획

담당 분야:
- CEO: 전략, 결정, 우선순위, 방향
- CTO: 코드, 버그, 아키텍처, 기술, 개발
- CFO: 비용, 예산, ROI, 재무
- CMO: 마케팅, UX, 사용자, 브랜드
- CSO: 전략기획, 로드맵, 경쟁분석
- CDO: 데이터, 분석, 지표, AI모델

응답 형식 (JSON만, 설명 없이):
{
  "mode": "Direct|Lead|Full",
  "agents": ["역할1", "역할2"],
  "lead": "주도역할",
  "reason": "한줄 이유",
  "confidence": 0.0~1.0
}`

export function parseClassifierResponse(raw: string): ClassifierResult {
  const fallback: ClassifierResult = {
    mode: 'Direct',
    agents: ['CEO'],
    lead: 'CEO',
    reason: '분류 실패, Direct 모드로 폴백',
    confidence: 0,
  }

  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    if (!VALID_MODES.includes(parsed.mode)) return fallback
    if (!VALID_ROLES.includes(parsed.lead)) return fallback

    return {
      mode: parsed.mode,
      agents: (parsed.agents as string[]).filter((a): a is AgentRole => VALID_ROLES.includes(a as AgentRole)),
      lead: parsed.lead as AgentRole,
      reason: parsed.reason || '',
      confidence: Number(parsed.confidence) || 0,
    }
  } catch {
    return fallback
  }
}

export async function classifyTask(userInput: string): Promise<ClassifierResult> {
  const client = new Anthropic()

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: CLASSIFIER_PROMPT,
    messages: [{ role: 'user', content: userInput }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  return parseClassifierResponse(raw)
}
```

- [ ] **Step 4: Classify API Route 작성**

`app/api/classify/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { classifyTask } from '@/lib/classifier'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message required' }, { status: 400 })
    }

    const result = await classifyTask(message)
    return NextResponse.json(result)
  } catch (error) {
    console.error('classify error:', error)
    return NextResponse.json({ error: 'classification failed' }, { status: 500 })
  }
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
npx jest __tests__/classifier.test.ts
```
Expected: PASS

- [ ] **Step 6: 커밋**

```bash
git add lib/classifier.ts app/api/classify/route.ts __tests__/classifier.test.ts
git commit -m "feat: add task classifier with haiku pre-classification"
```

---

### Task 8: Base Agent + 6개 에이전트

**Files:**
- Create: `lib/agents/base-agent.ts`
- Create: `lib/agents/ceo.ts`, `cto.ts`, `cfo.ts`, `cmo.ts`, `cso.ts`, `cdo.ts`

- [ ] **Step 1: Base Agent 작성**

`lib/agents/base-agent.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from '@/lib/skills-loader'
import type { AgentRole, AgentSummary } from '@/lib/types'

const client = new Anthropic()

interface AgentCallOptions {
  role: AgentRole
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
}

export async function callAgent({ role, messages, onChunk }: AgentCallOptions): Promise<AgentSummary> {
  const systemPrompt = buildSystemPrompt(role)
  let fullResponse = ''

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      onChunk(event.delta.text)
      fullResponse += event.delta.text
    }
  }

  return {
    role,
    status: 'completed',
    result: fullResponse,
  }
}
```

- [ ] **Step 2: 각 에이전트 모듈 작성 (CEO)**

`lib/agents/ceo.ts`:
```typescript
import { callAgent } from './base-agent'
import type { AgentSummary } from '@/lib/types'

interface CEOOptions {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
}

export async function runCEO({ messages, onChunk }: CEOOptions): Promise<AgentSummary> {
  return callAgent({ role: 'CEO', messages, onChunk })
}

export async function runCEOSynthesis(
  userMessage: string,
  agentSummaries: AgentSummary[],
  onChunk: (chunk: string) => void
): Promise<AgentSummary> {
  const summaryContent = agentSummaries
    .map(s => `[${s.role}] ${s.result}`)
    .join('\n\n')

  const synthesisMessages = [
    {
      role: 'user' as const,
      content: `팀원들의 의견을 종합해서 박효균님께 보고해주세요.

원래 요청: ${userMessage}

팀원 의견:
${summaryContent}

팀원들 의견을 바탕으로 핵심을 정리하고, 진행 여부를 확인하는 메시지로 마무리해주세요.`,
    },
  ]

  return callAgent({ role: 'CEO', messages: synthesisMessages, onChunk })
}
```

- [ ] **Step 3: CTO 에이전트 작성**

`lib/agents/cto.ts`:
```typescript
import { callAgent } from './base-agent'
import type { AgentSummary } from '@/lib/types'

interface CTOOptions {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
  useCliIfNeeded?: boolean
}

export async function runCTO({ messages, onChunk }: CTOOptions): Promise<AgentSummary> {
  return callAgent({ role: 'CTO', messages, onChunk })
}
```

- [ ] **Step 4: 나머지 에이전트 작성 (CFO, CMO, CSO, CDO)**

`lib/agents/cfo.ts`:
```typescript
import { callAgent } from './base-agent'
import type { AgentSummary } from '@/lib/types'

export async function runCFO(options: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
}): Promise<AgentSummary> {
  return callAgent({ role: 'CFO', ...options })
}
```

`lib/agents/cmo.ts`:
```typescript
import { callAgent } from './base-agent'
import type { AgentSummary } from '@/lib/types'

export async function runCMO(options: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
}): Promise<AgentSummary> {
  return callAgent({ role: 'CMO', ...options })
}
```

`lib/agents/cso.ts`:
```typescript
import { callAgent } from './base-agent'
import type { AgentSummary } from '@/lib/types'

export async function runCSO(options: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
}): Promise<AgentSummary> {
  return callAgent({ role: 'CSO', ...options })
}
```

`lib/agents/cdo.ts`:
```typescript
import { callAgent } from './base-agent'
import type { AgentSummary } from '@/lib/types'

export async function runCDO(options: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
}): Promise<AgentSummary> {
  return callAgent({ role: 'CDO', ...options })
}
```

- [ ] **Step 5: 타입 확인**

```bash
npx tsc --noEmit
```
Expected: 에러 없음

- [ ] **Step 6: 커밋**

```bash
git add lib/agents/
git commit -m "feat: add base agent and 6 role agents"
```

---

### Task 9: CLI Bridge (CTO 전용)

**Files:**
- Create: `lib/cli-bridge.ts`

- [ ] **Step 1: CLI Bridge 작성**

`lib/cli-bridge.ts`:
```typescript
import { spawn } from 'child_process'

export interface CLIBridgeOptions {
  prompt: string
  workdir?: string
  onOutput: (chunk: string) => void
  onError: (error: string) => void
}

export function runClaudeCLI({
  prompt,
  workdir = process.cwd(),
  onOutput,
  onError,
}: CLIBridgeOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const fullOutput: string[] = []

    // claude CLI가 설치되어 있어야 함 (claude --version으로 확인)
    const proc = spawn('claude', ['--print', prompt], {
      cwd: workdir,
      env: { ...process.env },
    })

    proc.stdout.on('data', (data: Buffer) => {
      const chunk = data.toString()
      fullOutput.push(chunk)
      onOutput(chunk)
    })

    proc.stderr.on('data', (data: Buffer) => {
      onError(data.toString())
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(fullOutput.join(''))
      } else {
        reject(new Error(`claude CLI exited with code ${code}`))
      }
    })

    proc.on('error', (err) => {
      reject(new Error(`claude CLI not found: ${err.message}`))
    })

    // 타임아웃: 5분
    setTimeout(() => {
      proc.kill()
      reject(new Error('CLI timeout after 5 minutes'))
    }, 5 * 60 * 1000)
  })
}
```

- [ ] **Step 2: 커밋**

```bash
git add lib/cli-bridge.ts
git commit -m "feat: add Claude Code CLI bridge for CTO agent"
```

---

### Task 10: Orchestrator

**Files:**
- Create: `lib/orchestrator.ts`
- Create: `__tests__/orchestrator.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`__tests__/orchestrator.test.ts`:
```typescript
import { getAgentExecutionOrder } from '@/lib/orchestrator'

describe('getAgentExecutionOrder', () => {
  it('Direct 모드는 CEO만 반환한다', () => {
    const result = getAgentExecutionOrder({ mode: 'Direct', agents: ['CEO'], lead: 'CEO', reason: '', confidence: 1 })
    expect(result).toEqual(['CEO'])
  })

  it('Lead 모드는 lead 에이전트 + CEO 순서로 반환한다', () => {
    const result = getAgentExecutionOrder({ mode: 'Lead', agents: ['CTO'], lead: 'CTO', reason: '', confidence: 1 })
    expect(result[0]).toBe('CTO')
    expect(result[result.length - 1]).toBe('CEO')
  })

  it('Full 모드는 agents 순서대로 + CEO 마지막으로 반환한다', () => {
    const result = getAgentExecutionOrder({ mode: 'Full', agents: ['CTO', 'CFO', 'CMO'], lead: 'CTO', reason: '', confidence: 1 })
    expect(result[result.length - 1]).toBe('CEO')
    expect(result).toContain('CTO')
    expect(result).toContain('CFO')
    expect(result).toContain('CMO')
  })

  it('CEO는 agents 목록에 있어도 마지막에 한 번만 나온다', () => {
    const result = getAgentExecutionOrder({ mode: 'Full', agents: ['CEO', 'CTO'], lead: 'CTO', reason: '', confidence: 1 })
    const ceoCount = result.filter(r => r === 'CEO').length
    expect(ceoCount).toBe(1)
    expect(result[result.length - 1]).toBe('CEO')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx jest __tests__/orchestrator.test.ts
```
Expected: FAIL

- [ ] **Step 3: Orchestrator 구현**

`lib/orchestrator.ts`:
```typescript
import type { AgentRole, AgentSummary, ClassifierResult } from '@/lib/types'
import { emitEvent, updateSessionStatus } from '@/lib/event-bus'
import { ContextManager } from '@/lib/context-manager'
import { runCEO, runCEOSynthesis } from '@/lib/agents/ceo'
import { runCTO } from '@/lib/agents/cto'
import { runCFO } from '@/lib/agents/cfo'
import { runCMO } from '@/lib/agents/cmo'
import { runCSO } from '@/lib/agents/cso'
import { runCDO } from '@/lib/agents/cdo'

const AGENT_RUNNERS: Record<AgentRole, (opts: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  onChunk: (chunk: string) => void
}) => Promise<AgentSummary>> = {
  CEO: runCEO,
  CTO: runCTO,
  CFO: runCFO,
  CMO: runCMO,
  CSO: runCSO,
  CDO: runCDO,
}

export function getAgentExecutionOrder(classifier: ClassifierResult): AgentRole[] {
  if (classifier.mode === 'Direct') return ['CEO']

  // CEO 제외한 에이전트 순서 (lead 먼저)
  const others = classifier.agents
    .filter(a => a !== 'CEO')
    .sort((a, b) => (a === classifier.lead ? -1 : b === classifier.lead ? 1 : 0))

  return [...others, 'CEO']
}

export async function runOrchestration(
  sessionId: string,
  userMessage: string,
  classifier: ClassifierResult,
  contextManager: ContextManager
): Promise<void> {
  updateSessionStatus(sessionId, 'running')
  const order = getAgentExecutionOrder(classifier)
  const summaries: AgentSummary[] = []
  const MAX_TURNS = 10

  // CEO 제외 에이전트 실행
  const nonCEOAgents = order.filter(r => r !== 'CEO')

  for (let i = 0; i < Math.min(nonCEOAgents.length, MAX_TURNS); i++) {
    const role = nonCEOAgents[i]
    const messages = [
      ...contextManager.getMessagesForAPI(),
      { role: 'user' as const, content: userMessage },
    ]

    emitEvent(sessionId, { type: 'message_start', agentRole: role })

    try {
      const summary = await AGENT_RUNNERS[role]({
        messages,
        onChunk: (chunk) => emitEvent(sessionId, { type: 'message_delta', agentRole: role, content: chunk }),
      })
      summaries.push(summary)
      contextManager.addAgentSummary(summary)
      emitEvent(sessionId, { type: 'message_end', agentRole: role })
    } catch (err) {
      emitEvent(sessionId, { type: 'error', agentRole: role, error: String(err) })
    }
  }

  // CEO 종합
  emitEvent(sessionId, { type: 'message_start', agentRole: 'CEO' })

  if (summaries.length === 0) {
    // Direct 모드: CEO 단독 실행
    const messages = [
      ...contextManager.getMessagesForAPI(),
      { role: 'user' as const, content: userMessage },
    ]
    const summary = await runCEO({
      messages,
      onChunk: (chunk) => emitEvent(sessionId, { type: 'message_delta', agentRole: 'CEO', content: chunk }),
    })
    summaries.push(summary)
  } else {
    // CEO 종합 보고
    await runCEOSynthesis(
      userMessage,
      summaries.filter(s => s.role !== 'CEO'),
      (chunk) => emitEvent(sessionId, { type: 'message_delta', agentRole: 'CEO', content: chunk })
    )
  }

  emitEvent(sessionId, { type: 'message_end', agentRole: 'CEO' })
  emitEvent(sessionId, { type: 'confirm_request' })
  updateSessionStatus(sessionId, 'waiting_confirm')
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx jest __tests__/orchestrator.test.ts
```
Expected: PASS

- [ ] **Step 5: 커밋**

```bash
git add lib/orchestrator.ts __tests__/orchestrator.test.ts
git commit -m "feat: add orchestrator with multi-agent execution logic"
```

---

### Task 11: SSE Stream API + Chat API

**Files:**
- Create: `app/api/stream/route.ts`
- Create: `app/api/chat/route.ts`

- [ ] **Step 1: SSE Stream 엔드포인트 작성**

`app/api/stream/route.ts`:
```typescript
import { eventBus, getSession, createSession, scheduleCleanup } from '@/lib/event-bus'
import type { SessionEvent } from '@/lib/types'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sessionId = url.searchParams.get('sessionId')

  if (!sessionId) {
    return new Response('sessionId required', { status: 400 })
  }

  // 세션 없으면 생성
  if (!getSession(sessionId)) createSession(sessionId)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: SessionEvent) => {
        try {
          const data = `data: ${JSON.stringify(event)}\n\n`
          controller.enqueue(encoder.encode(data))
        } catch {
          // 클라이언트 연결 끊김
        }
      }

      // 기존 누적 이벤트 전송 (재연결 대응)
      const session = getSession(sessionId)
      if (session) {
        for (const event of session.events) send(event)
      }

      eventBus.on(sessionId, send)

      req.signal.addEventListener('abort', () => {
        eventBus.off(sessionId, send)
        controller.close()
        scheduleCleanup(sessionId)
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

- [ ] **Step 2: Chat API 작성**

`app/api/chat/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/event-bus'
import { ContextManager } from '@/lib/context-manager'
import { runOrchestration } from '@/lib/orchestrator'
import type { ClassifierResult } from '@/lib/types'

// 세션별 ContextManager 인메모리 보관
const contextManagers = new Map<string, ContextManager>()

export async function POST(req: Request) {
  try {
    const { sessionId, message, classifier } = await req.json() as {
      sessionId: string
      message: string
      classifier: ClassifierResult
    }

    if (!sessionId || !message || !classifier) {
      return NextResponse.json({ error: 'sessionId, message, classifier required' }, { status: 400 })
    }

    createSession(sessionId)

    if (!contextManagers.has(sessionId)) {
      contextManagers.set(sessionId, new ContextManager(20))
    }
    const cm = contextManagers.get(sessionId)!

    // 오케스트레이션은 비동기 실행 (응답 즉시 반환, SSE로 실시간 전달)
    runOrchestration(sessionId, message, classifier, cm).catch(err => {
      console.error('orchestration error:', err)
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('chat error:', error)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
```

- [ ] **Step 3: 타입 확인**

```bash
npx tsc --noEmit
```
Expected: 에러 없음

- [ ] **Step 4: 커밋**

```bash
git add app/api/stream/route.ts app/api/chat/route.ts
git commit -m "feat: add SSE stream and chat API endpoints"
```

---

## Phase 3: Skills API

### Task 12: Skills CRUD API

**Files:**
- Create: `app/api/skills/route.ts`
- Create: `app/api/skills/[id]/route.ts`

- [ ] **Step 1: Skills GET/POST Route 작성**

`app/api/skills/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { randomUUID } from 'crypto'
import type { Skill, AgentRole } from '@/lib/types'

const CUSTOM_DIR = path.join(process.cwd(), 'data', 'skills', 'custom')
const BASE_DIR = path.join(process.cwd(), 'data', 'skills', 'base')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export async function GET() {
  ensureDir(CUSTOM_DIR)

  const skills: Skill[] = []

  // base 스킬 로드
  const roles = ['ceo', 'cto', 'cfo', 'cmo', 'cso', 'cdo']
  for (const role of roles) {
    const filePath = path.join(BASE_DIR, `${role}.md`)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      if (content.trim()) {
        skills.push({
          id: `base-${role}`,
          name: `${role.toUpperCase()} 기본 스킬`,
          content,
          agents: [role.toUpperCase() as AgentRole],
          isBase: true,
          createdAt: fs.statSync(filePath).mtimeMs,
        })
      }
    }
  }

  // custom 스킬 로드
  const files = fs.readdirSync(CUSTOM_DIR).filter(f => f.endsWith('.json'))
  for (const file of files) {
    try {
      const skill = JSON.parse(fs.readFileSync(path.join(CUSTOM_DIR, file), 'utf-8')) as Skill
      skills.push(skill)
    } catch {
      // 손상 파일 무시
    }
  }

  return NextResponse.json(skills)
}

export async function POST(req: Request) {
  ensureDir(CUSTOM_DIR)

  const body = await req.json() as { name: string; content: string; agents: AgentRole[] }

  if (!body.name || !body.content) {
    return NextResponse.json({ error: 'name and content required' }, { status: 400 })
  }

  const skill: Skill = {
    id: randomUUID(),
    name: body.name,
    content: body.content,
    agents: body.agents || [],
    isBase: false,
    createdAt: Date.now(),
  }

  fs.writeFileSync(path.join(CUSTOM_DIR, `${skill.id}.json`), JSON.stringify(skill, null, 2))

  return NextResponse.json(skill, { status: 201 })
}
```

- [ ] **Step 2: Skills DELETE Route 작성**

`app/api/skills/[id]/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

const CUSTOM_DIR = path.join(process.cwd(), 'data', 'skills', 'custom')

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const filePath = path.join(CUSTOM_DIR, `${id}.json`)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'skill not found' }, { status: 404 })
  }

  fs.unlinkSync(filePath)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: 커밋**

```bash
git add app/api/skills/
git commit -m "feat: add skills CRUD API endpoints"
```

---

## Phase 4: 프론트엔드 컴포넌트

### Task 13: AgentSidebar 컴포넌트

**Files:**
- Create: `components/chat/AgentSidebar.tsx`

- [ ] **Step 1: AgentSidebar 작성**

`components/chat/AgentSidebar.tsx`:
```typescript
'use client'

import { AGENT_CONFIGS } from '@/lib/types'
import type { AgentRole, AgentStatus } from '@/lib/types'

interface Props {
  agentStatuses: Record<AgentRole, AgentStatus>
}

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: '대기',
  active: '작업 중',
  waiting: '대기',
  done: '완료',
}

const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: 'bg-gray-300',
  active: 'bg-green-400 animate-pulse',
  waiting: 'bg-yellow-400',
  done: 'bg-blue-400',
}

export function AgentSidebar({ agentStatuses }: Props) {
  const roles = Object.keys(AGENT_CONFIGS) as AgentRole[]

  return (
    <div className="w-24 flex-shrink-0 bg-gray-50 border-r border-gray-200 py-4 flex flex-col gap-3 items-center">
      {roles.map((role) => {
        const config = AGENT_CONFIGS[role]
        const status = agentStatuses[role]

        return (
          <div key={role} className="flex flex-col items-center gap-1 w-full px-2">
            <div className="text-2xl">{config.emoji}</div>
            <div className="text-xs font-semibold text-gray-700">{role}</div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />
              <span className="text-xs text-gray-500">{STATUS_LABELS[status]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/chat/AgentSidebar.tsx
git commit -m "feat: add agent sidebar component with status indicators"
```

---

### Task 14: TypingIndicator + MessageBubble 컴포넌트

**Files:**
- Create: `components/chat/TypingIndicator.tsx`
- Create: `components/chat/MessageBubble.tsx`

- [ ] **Step 1: TypingIndicator 작성**

`components/chat/TypingIndicator.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'
import { AGENT_CONFIGS } from '@/lib/types'
import type { AgentRole } from '@/lib/types'

interface Props {
  role: AgentRole
}

export function TypingIndicator({ role }: Props) {
  const config = AGENT_CONFIGS[role]

  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xl">{config.emoji}</span>
        <span className="text-xs text-gray-500 font-medium">{role}</span>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: MessageBubble 작성**

`components/chat/MessageBubble.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'
import { AGENT_CONFIGS } from '@/lib/types'
import type { Message } from '@/lib/types'

interface Props {
  message: Message
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-2"
      >
        <div className="bg-yellow-400 text-gray-900 rounded-2xl rounded-br-none px-4 py-3 max-w-xs shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  const config = message.agentRole ? AGENT_CONFIGS[message.agentRole] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2 mb-2"
    >
      {config && (
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-xl">{config.emoji}</span>
          <span className="text-xs text-gray-500 font-medium">{message.agentRole}</span>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-sm shadow-sm">
        {message.content ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="flex gap-1 items-center h-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
        <span className="text-xs text-gray-400 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/chat/TypingIndicator.tsx components/chat/MessageBubble.tsx
git commit -m "feat: add typing indicator and message bubble components"
```

---

### Task 15: ConfirmBar + InputBar 컴포넌트

**Files:**
- Create: `components/chat/ConfirmBar.tsx`
- Create: `components/chat/InputBar.tsx`

- [ ] **Step 1: ConfirmBar 작성**

`components/chat/ConfirmBar.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ClassifierResult } from '@/lib/types'

interface Props {
  classifierResult: ClassifierResult
  onConfirm: (answer: 'yes' | 'no' | string) => void
}

export function ConfirmBar({ classifierResult, onConfirm }: Props) {
  const [customText, setCustomText] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border-t border-blue-200 px-4 py-3"
    >
      <p className="text-xs text-blue-600 mb-2 font-medium">
        {classifierResult.mode} 모드 —{' '}
        {classifierResult.agents.join(', ')} 참여 ({classifierResult.reason})
      </p>
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => onConfirm('yes')}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
        >
          진행
        </button>
        <button
          onClick={() => onConfirm('no')}
          className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
        >
          다시 분류
        </button>
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="bg-white border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            직접 수정
          </button>
        ) : (
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="수정 지시 입력..."
              className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm outline-none focus:border-blue-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customText.trim()) {
                  onConfirm(customText.trim())
                  setCustomText('')
                  setShowCustom(false)
                }
              }}
              autoFocus
            />
            <button
              onClick={() => {
                if (customText.trim()) {
                  onConfirm(customText.trim())
                  setCustomText('')
                  setShowCustom(false)
                }
              }}
              className="bg-blue-500 text-white text-sm px-3 py-1.5 rounded-full hover:bg-blue-600"
            >
              적용
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: InputBar 작성**

`components/chat/InputBar.tsx`:
```typescript
'use client'

import { useState, useRef } from 'react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export function InputBar({ onSend, disabled }: Props) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    inputRef.current?.focus()
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 flex gap-3 items-center">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        placeholder={disabled ? '에이전트 작업 중...' : '지시사항을 입력하세요'}
        disabled={disabled}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-300 transition-all disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 disabled:opacity-40 transition-colors flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  )
}
```

- [ ] **Step 3: 커밋**

```bash
git add components/chat/ConfirmBar.tsx components/chat/InputBar.tsx
git commit -m "feat: add confirm bar and input bar components"
```

---

### Task 16: useSSE + useChat Hooks

**Files:**
- Create: `hooks/useSSE.ts`
- Create: `hooks/useChat.ts`

- [ ] **Step 1: useSSE 훅 작성**

`hooks/useSSE.ts`:
```typescript
'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { SessionEvent } from '@/lib/types'

interface UseSSEOptions {
  sessionId: string | null
  onEvent: (event: SessionEvent) => void
}

export function useSSE({ sessionId, onEvent }: UseSSEOptions) {
  const esRef = useRef<EventSource | null>(null)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  const connect = useCallback((id: string) => {
    if (esRef.current) esRef.current.close()

    const es = new EventSource(`/api/stream?sessionId=${id}`)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as SessionEvent
        onEventRef.current(event)
      } catch {
        // JSON 파싱 실패 무시
      }
    }

    es.onerror = () => {
      es.close()
    }
  }, [])

  useEffect(() => {
    if (sessionId) connect(sessionId)
    return () => esRef.current?.close()
  }, [sessionId, connect])
}
```

- [ ] **Step 2: useChat 훅 작성**

`hooks/useChat.ts`:
```typescript
'use client'

import { useState, useCallback, useRef } from 'react'
import { randomUUID } from 'crypto'
import { useSSE } from './useSSE'
import type { Message, AgentRole, AgentStatus, ClassifierResult, SessionEvent } from '@/lib/types'
import { AGENT_CONFIGS } from '@/lib/types'

const DEFAULT_STATUSES = (): Record<AgentRole, AgentStatus> =>
  Object.keys(AGENT_CONFIGS).reduce(
    (acc, role) => ({ ...acc, [role]: 'idle' }),
    {} as Record<AgentRole, AgentStatus>
  )

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentRole, AgentStatus>>(DEFAULT_STATUSES())
  const [isLoading, setIsLoading] = useState(false)
  const [pendingConfirm, setPendingConfirm] = useState<ClassifierResult | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const pendingMessageRef = useRef<string | null>(null)
  const streamingRef = useRef<Map<AgentRole, string>>(new Map())

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: randomUUID(), timestamp: Date.now() }])
  }, [])

  const handleSSEEvent = useCallback((event: SessionEvent) => {
    switch (event.type) {
      case 'message_start':
        if (event.agentRole) {
          setAgentStatuses(prev => ({ ...prev, [event.agentRole!]: 'active' }))
          streamingRef.current.set(event.agentRole, '')
          // 빈 스트리밍 메시지 추가
          setMessages(prev => [...prev, {
            id: `streaming-${event.agentRole}`,
            role: 'agent',
            agentRole: event.agentRole,
            content: '',
            timestamp: Date.now(),
            isStreaming: true,
          }])
        }
        break

      case 'message_delta':
        if (event.agentRole && event.content) {
          const current = (streamingRef.current.get(event.agentRole) || '') + event.content
          streamingRef.current.set(event.agentRole, current)
          setMessages(prev => prev.map(m =>
            m.id === `streaming-${event.agentRole}`
              ? { ...m, content: current }
              : m
          ))
        }
        break

      case 'message_end':
        if (event.agentRole) {
          setAgentStatuses(prev => ({ ...prev, [event.agentRole!]: 'done' }))
          setMessages(prev => prev.map(m =>
            m.id === `streaming-${event.agentRole}`
              ? { ...m, isStreaming: false }
              : m
          ))
        }
        break

      case 'confirm_request':
        setIsLoading(false)
        // CEO 완료 후 확인창은 이미 pendingConfirm으로 표시됨
        break

      case 'done':
        setIsLoading(false)
        setAgentStatuses(DEFAULT_STATUSES())
        break

      case 'error':
        setIsLoading(false)
        if (event.error) {
          addMessage({ role: 'agent', agentRole: 'CEO', content: `문제가 생겼어요: ${event.error}` })
        }
        break
    }
  }, [addMessage])

  useSSE({ sessionId, onEvent: handleSSEEvent })

  const sendMessage = useCallback(async (message: string) => {
    addMessage({ role: 'user', content: message })
    setIsLoading(true)
    pendingMessageRef.current = message

    // Step 1: Classify
    const classifyRes = await fetch('/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const classifier = await classifyRes.json() as ClassifierResult
    setPendingConfirm(classifier)
    setIsLoading(false)
  }, [addMessage])

  const handleConfirm = useCallback(async (answer: 'yes' | 'no' | string) => {
    const message = pendingMessageRef.current
    if (!message) return

    if (answer === 'no') {
      // 재분류 (동일 메시지 다시 classify)
      setIsLoading(true)
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message + ' (재분류 요청)' }),
      })
      const classifier = await res.json() as ClassifierResult
      setPendingConfirm(classifier)
      setIsLoading(false)
      return
    }

    // yes 또는 직접입력
    setPendingConfirm(null)
    setIsLoading(true)

    const id = `session-${Date.now()}`
    setSessionId(id)

    const classifyRes = await fetch('/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: answer !== 'yes' ? `${message}\n추가 지시: ${answer}` : message }),
    })
    const finalClassifier = answer !== 'yes'
      ? await classifyRes.json() as ClassifierResult
      : (pendingMessageRef.current ? await (await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        })).json() : null)

    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: id,
        message,
        classifier: finalClassifier,
      }),
    })
  }, [])

  return {
    messages,
    agentStatuses,
    isLoading,
    pendingConfirm,
    sendMessage,
    handleConfirm,
  }
}
```

- [ ] **Step 3: 커밋**

```bash
git add hooks/useSSE.ts hooks/useChat.ts
git commit -m "feat: add useSSE and useChat hooks"
```

---

### Task 17: ChatRoom 컴포넌트 + 메인 페이지

**Files:**
- Create: `components/chat/ChatRoom.tsx`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: ChatRoom 작성**

`components/chat/ChatRoom.tsx`:
```typescript
'use client'

import { useRef, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { AgentSidebar } from './AgentSidebar'
import { MessageBubble } from './MessageBubble'
import { ConfirmBar } from './ConfirmBar'
import { InputBar } from './InputBar'

export function ChatRoom() {
  const { messages, agentStatuses, isLoading, pendingConfirm, sendMessage, handleConfirm } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <h1 className="font-bold text-gray-900 text-lg">AI-Team</h1>
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
          {isLoading ? '● 작업 중' : '● 대기 중'}
        </span>
        <div className="ml-auto flex gap-2">
          <a href="/skills" className="text-sm text-gray-500 hover:text-gray-700">스킬 관리</a>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex flex-1 overflow-hidden">
        <AgentSidebar agentStatuses={agentStatuses} />

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 확인 바 */}
      {pendingConfirm && !isLoading && (
        <ConfirmBar
          classifierResult={pendingConfirm}
          onConfirm={handleConfirm}
        />
      )}

      {/* 입력 바 */}
      <InputBar onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
```

- [ ] **Step 2: 메인 페이지 작성**

`app/page.tsx`:
```typescript
import { ChatRoom } from '@/components/chat/ChatRoom'

export default function Home() {
  return <ChatRoom />
}
```

- [ ] **Step 3: 레이아웃 수정**

`app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI-Team',
  description: '6명의 AI 에이전트 AX 조직',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 4: 개발 서버에서 동작 확인**

```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속 확인:
- 채팅방 레이아웃 표시
- 에이전트 사이드바 표시
- 입력창 동작

- [ ] **Step 5: 커밋**

```bash
git add components/chat/ChatRoom.tsx app/page.tsx app/layout.tsx
git commit -m "feat: add ChatRoom component and main page"
```

---

## Phase 5: Skills 관리 UI

### Task 18: Skills 컴포넌트 + 페이지

**Files:**
- Create: `components/skills/SkillsList.tsx`
- Create: `components/skills/SkillUpload.tsx`
- Create: `app/skills/page.tsx`

- [ ] **Step 1: SkillsList 작성**

`components/skills/SkillsList.tsx`:
```typescript
'use client'

import type { Skill } from '@/lib/types'
import { AGENT_CONFIGS } from '@/lib/types'

interface Props {
  skills: Skill[]
  onDelete: (id: string) => void
}

export function SkillsList({ skills, onDelete }: Props) {
  if (skills.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-8">등록된 스킬이 없습니다</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {skills.map((skill) => (
        <div key={skill.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-800 text-sm">{skill.name}</h3>
                {skill.isBase && (
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">기본</span>
                )}
              </div>
              <div className="flex gap-1 flex-wrap mb-2">
                {skill.agents.length === 0 ? (
                  <span className="text-xs text-gray-400">전체 에이전트</span>
                ) : (
                  skill.agents.map((role) => (
                    <span key={role} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {AGENT_CONFIGS[role].emoji} {role}
                    </span>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{skill.content}</p>
            </div>
            {!skill.isBase && (
              <button
                onClick={() => onDelete(skill.id)}
                className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: SkillUpload 작성**

`components/skills/SkillUpload.tsx`:
```typescript
'use client'

import { useState } from 'react'
import type { AgentRole } from '@/lib/types'
import { AGENT_CONFIGS } from '@/lib/types'

interface Props {
  onAdd: (name: string, content: string, agents: AgentRole[]) => void
}

const ALL_ROLES = Object.keys(AGENT_CONFIGS) as AgentRole[]

export function SkillUpload({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [selectedAgents, setSelectedAgents] = useState<AgentRole[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const toggleAgent = (role: AgentRole) => {
    setSelectedAgents(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    )
  }

  const handleSubmit = () => {
    if (!name.trim() || !content.trim()) return
    onAdd(name.trim(), content.trim(), selectedAgents)
    setName('')
    setContent('')
    setSelectedAgents([])
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-500 text-white rounded-xl py-3 text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        + 새 스킬 추가
      </button>
    )
  }

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-4 flex flex-col gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="스킬 이름"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="스킬 내용 (마크다운 지원)"
        rows={6}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
      />
      <div>
        <p className="text-xs text-gray-500 mb-2">적용 에이전트 (미선택 = 전체)</p>
        <div className="flex flex-wrap gap-2">
          {ALL_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => toggleAgent(role)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedAgents.includes(role)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
              }`}
            >
              {AGENT_CONFIGS[role].emoji} {role}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !content.trim()}
          className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-600 disabled:opacity-40 transition-colors"
        >
          추가
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 bg-gray-100 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Skills 페이지 작성**

`app/skills/page.tsx`:
```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { SkillsList } from '@/components/skills/SkillsList'
import { SkillUpload } from '@/components/skills/SkillUpload'
import type { Skill, AgentRole } from '@/lib/types'
import Link from 'next/link'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSkills = useCallback(async () => {
    const res = await fetch('/api/skills')
    const data = await res.json()
    setSkills(data)
    setIsLoading(false)
  }, [])

  useEffect(() => { fetchSkills() }, [fetchSkills])

  const handleAdd = async (name: string, content: string, agents: AgentRole[]) => {
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content, agents }),
    })
    fetchSkills()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    fetchSkills()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">← 돌아가기</Link>
        <h1 className="font-bold text-gray-900">스킬 관리</h1>
      </div>
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">
        <SkillUpload onAdd={handleAdd} />
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm">로딩 중...</p>
        ) : (
          <SkillsList skills={skills} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 스킬 페이지 동작 확인**

```bash
# 개발 서버 실행 중이어야 함
# http://localhost:3000/skills 접속
# 스킬 추가/삭제 동작 확인
```

- [ ] **Step 5: 커밋**

```bash
git add components/skills/ app/skills/
git commit -m "feat: add skills management UI"
```

---

## Phase 6: 통합 테스트 + 마무리

### Task 19: 전체 플로우 통합 확인

- [ ] **Step 1: 전체 테스트 실행**

```bash
npx jest
```
Expected: 모든 테스트 PASS

- [ ] **Step 2: E2E 플로우 수동 확인**

```bash
npm run dev
```

확인 항목:
1. `http://localhost:3000` 접속 → 채팅방 표시
2. 메시지 입력 → 분류 결과 + ConfirmBar 표시
3. "진행" 클릭 → 에이전트들 순차 말풍선 스트리밍
4. CEO 종합 메시지 표시
5. `http://localhost:3000/skills` → 스킬 추가/삭제

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```
Expected: 빌드 에러 없음

- [ ] **Step 4: 타입 최종 확인**

```bash
npx tsc --noEmit
```
Expected: 에러 없음

- [ ] **Step 5: 최종 커밋**

```bash
git add -A
git commit -m "feat: complete AI-Team initial implementation"
```

---

### Task 20: Base 스킬 파일 초기 내용 작성

**Files:**
- Modify: `data/skills/base/ceo.md` ~ `cdo.md`

- [ ] **Step 1: CEO 스킬 작성**

`data/skills/base/ceo.md`:
```markdown
## CEO 의사결정 원칙
- 데이터보다 방향이 먼저다. 숫자는 판단을 보조하는 도구.
- 팀 의견이 엇갈릴 때는 박효균님의 목표와 가장 가까운 선택을 우선한다.
- 보고할 때는 결론 → 이유 → 다음 행동 순서로.
- 모호한 건 그냥 진행하지 말고 반드시 확인 받는다.
```

- [ ] **Step 2: CTO 스킬 작성**

`data/skills/base/cto.md`:
```markdown
## CTO 기술 원칙
- 완벽한 코드보다 동작하는 코드가 먼저다. 리팩토링은 나중에.
- 버그 리포트는 재현 방법 → 원인 → 수정 내용 순서로.
- 새 기술 도입 제안 시 학습 비용과 유지보수 부담을 함께 언급한다.
- 코드 실행이 필요하면 직접 실행하고 결과를 보여준다.
```

- [ ] **Step 3: CFO 스킬 작성**

`data/skills/base/cfo.md`:
```markdown
## CFO 재무 원칙
- 비용을 말할 때는 절대값과 비율 둘 다 제시한다.
- ROI 계산 시 기회비용을 포함한다.
- "비싸다/싸다"는 비교 대상 없이 말하지 않는다.
- API 비용은 월간 기준으로 환산해서 보고한다.
```

- [ ] **Step 4: CMO 스킬 작성**

`data/skills/base/cmo.md`:
```markdown
## CMO 마케팅 원칙
- 사용자 관점에서 먼저 생각한다. "우리가 하고 싶은 것"이 아니라 "사용자가 원하는 것".
- 채널별 특성을 고려해서 메시지를 다르게 가져간다.
- 캠페인 제안 시 측정 지표를 함께 제시한다.
- UX 피드백은 구체적인 사용자 행동 기반으로 설명한다.
```

- [ ] **Step 5: CSO 스킬 작성**

`data/skills/base/cso.md`:
```markdown
## CSO 전략 원칙
- 전략은 "무엇을 하지 않을지"가 "무엇을 할지"만큼 중요하다.
- 로드맵은 6개월 이상은 분기 단위, 3개월 이내는 주 단위로 구체화한다.
- 경쟁사 분석 시 우리가 이길 수 있는 포지션을 찾는 데 집중한다.
- 전략 제안 후 반드시 실행 가능성을 점검한다.
```

- [ ] **Step 6: CDO 스킬 작성**

`data/skills/base/cdo.md`:
```markdown
## CDO 데이터 원칙
- 데이터 없는 주장은 가설로 표현한다. "~일 것 같다" X → "현재 데이터 없음, 가설로는..." O
- 지표는 허영 지표(Vanity Metric)와 행동 지표(Actionable Metric)를 구분한다.
- 분석 결과는 인사이트 → 근거 데이터 → 권고 행동 순서로.
- AI 모델 도입 제안 시 데이터 요구사항과 예상 정확도를 함께 제시한다.
```

- [ ] **Step 7: 커밋**

```bash
git add data/skills/base/
git commit -m "feat: add base skill files for all 6 agents"
```

---

## 자체 검토 (Spec vs Plan)

### Spec 커버리지

| 스펙 항목 | 구현 태스크 |
|---|---|
| Next.js 15 + Tailwind + Framer Motion | Task 1 |
| 공유 타입 | Task 2 |
| PWA | Task 3 |
| EventBus | Task 4 |
| Skills Loader | Task 5 |
| Context Manager | Task 6 |
| Pre-classifier (haiku) | Task 7 |
| 6개 에이전트 + Base Agent | Task 8 |
| CLI Bridge (CTO 전용) | Task 9 |
| Orchestrator + 3모드 + 순차실행 | Task 10 |
| SSE Stream + Chat API | Task 11 |
| Skills CRUD API | Task 12 |
| AgentSidebar | Task 13 |
| MessageBubble + TypingIndicator | Task 14 |
| ConfirmBar (Yes/No/직접입력) | Task 15 |
| useSSE + useChat | Task 16 |
| ChatRoom + 메인 페이지 | Task 17 |
| Skills 관리 UI | Task 18 |
| 통합 테스트 | Task 19 |
| Base 스킬 파일 | Task 20 |

**갭 없음. 모든 스펙 항목 커버됨.**
