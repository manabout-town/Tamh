# Dev Wallpaper — Design Spec
**Date:** 2026-06-23  
**Status:** Approved

---

## Overview

macOS 라이브 배경화면. Matrix 코드레인 위에 센터 HUD(시계+시스템 스탯)를 올리고, 레인 글자 소스는 로컬 Claude 스킬 이름과 설명에서 읽어옴. Plash가 HTML을 배경화면으로 렌더링하고, Node.js 로컬 서버가 시스템 데이터와 스킬 목록을 제공.

---

## Architecture

```
wallpaper.html   ←→   server.js (localhost:3939)
     ↑                     ↑
  Plash 렌더           launchd 자동시작
```

### 파일 구조
```
Desktop/dev-wallpaper/
├── wallpaper.html              # Plash가 배경화면으로 렌더링
├── server.js                   # 로컬 API 서버 (포트 3939)
├── install.sh                  # 원클릭 설치 스크립트
└── com.dev-wallpaper.plist     # launchd 자동시작 설정
```

---

## Components

### 1. wallpaper.html

**Matrix 코드레인 (Canvas)**
- 전체화면 `<canvas>` 위에 문자 컬럼들이 흘러내림
- 시작 시 `GET /skills` fetch → 스킬 이름+설명 단어 pool 구성
- 각 컬럼은 pool에서 랜덤 단어/단어 조각을 흘려보냄
- 폴백: fetch 실패 시 기본 ASCII/katakana 문자 사용
- 파라미터: 컬럼 너비 16px, 폰트 `'SF Mono', monospace` 14px

**Center HUD (HTML overlay, `position: fixed`)**
- 시계: `HH:MM:SS` (1초마다 업데이트)
- 바이너리 클럭: 현재 시/분/초를 이진수로 표시
- Unix timestamp: 정수로 표시, 매초 증가
- 타임존: 시스템 타임존 표시 (KST 등)
- 구분선
- 시스템 스탯: `GET /stats` 1초마다 폴링
  - CPU `%`, RAM `GB used / total`, NET `↑↓ MB/s`
  - 각 항목에 채워지는 바 그래프

**색상 프리셋 (5가지)**

| 이름 | 주색 | 보조 |
|------|------|------|
| Matrix Green | `#00ff41` | `#00cc33`, `#009922` |
| Cyber Cyan | `#00ffff` | `#00cccc`, `#0099aa` |
| Hacker Purple | `#bf00ff` | `#9900cc`, `#660088` |
| Ember | `#ff6600` | `#cc4400`, `#992200` |
| Neon Lime | `#39ff14` | `#00ff88`, `#00cc66` |

- `localStorage`에 선택 저장 (Plash 재시작 후에도 유지)
- 전환 방식: HUD 내 프리셋 도트 클릭 (항상 표시), 또는 키보드 `1`~`5`

---

### 2. server.js

**Node.js, 포트 3939, 의존성 0 (표준 라이브러리만)**

```
GET /stats   → { cpu: 23, ramUsed: 6.4, ramTotal: 16, netUp: 1.2, netDown: 3.4 }
GET /skills  → ["brainstorming", "Turn ideas into designs", "systematic-debugging", ...]
```

**`/stats` 구현**
- CPU: `top -l 1 -n 0` 파싱 (macOS)
- RAM: Node.js `os.freemem()` / `os.totalmem()`
- NET: `/proc/net/dev` 대신 `netstat -ib` 파싱 (macOS)
- 응답에 `Access-Control-Allow-Origin: *` 헤더 포함 (Plash 브라우저 CORS)

**`/skills` 구현**
- 스킬 디렉토리 스캔: `~/.claude/skills/*/SKILL.md` (93개 스킬)
- 각 `SKILL.md`의 YAML frontmatter 파싱:
  - `name:` → 스킬 이름 (영문, e.g. `brainstorming`)
  - `description:` → 설명 (한국어, e.g. `창의적인 작업 전에 반드시 사용`)
- 결과: 스킬 이름 + 설명을 단어/구절 단위로 분리한 배열 (한글+영문 혼합)
- 한글 설명이 레인에 흘러내리면 Matrix 특유의 이국적 문자 느낌과 시너지
- 캐시: 서버 시작 시 1회 읽어서 메모리에 유지 (파일 변경 감지 불필요)

---

### 3. install.sh

```bash
1. node --version 확인 (없으면 안내 출력 후 종료)
2. plash 설치 여부 확인 (없으면 brew 명령어 안내)
3. launchd plist를 ~/Library/LaunchAgents/에 복사
4. launchctl load로 서버 즉시 시작
5. wallpaper.html 경로를 Plash에 등록 (open 명령 + URL scheme)
6. 완료 메시지 출력
```

---

### 4. com.dev-wallpaper.plist

```xml
<!-- launchd: 로그인 시 server.js 자동 시작 -->
Label: com.dev-wallpaper
ProgramArguments: [node, /path/to/server.js]
RunAtLoad: true
KeepAlive: true
StandardOutPath: /tmp/dev-wallpaper.log
```

---

## Data Flow

```
[macOS 부팅]
    → launchd → server.js 시작 (포트 3939)
    → Plash 시작 → wallpaper.html 로드
    → wallpaper.html → GET /skills → 단어 pool 구성
    → Canvas 코드레인 시작 (pool 단어 사용)
    → 매 1초: GET /stats → HUD 업데이트
```

---

## Constraints & Decisions

- **Electron 금지** — 메모리에 따라 사용 불가. Plash + 순수 HTML/JS로 대체.
- **외부 npm 패키지 없음** — `server.js`는 Node.js 내장 모듈만 사용 (`http`, `os`, `fs`, `child_process`)
- **Plash 필수 의존성** — 설치 없이 동작 불가. install.sh에서 설치 여부 확인 및 안내.
- **스킬 경로 하드코딩 금지** — glob으로 버전 디렉토리 동적 탐색
- **CORS** — server.js가 `*` 허용해야 Plash WKWebView에서 fetch 가능

---

## Out of Scope

- GitHub API 연동 (추후 추가 가능)
- Windows/Linux 지원
- 설정 GUI (프리셋은 HUD 클릭으로 충분)
