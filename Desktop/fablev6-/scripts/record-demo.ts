/**
 * AI-AUTO CS Platform — Demo GIF Recording Script
 * Usage:
 *   1. npm run dev  (separate terminal, port 3002)
 *   2. npx ts-node scripts/record-demo.ts
 *
 * Scene 01 & 11: shows login intentionally
 * Scene 02-10:   starts directly at /inbox (storageState reuse)
 */

import { chromium, type Page, type BrowserContext } from 'playwright'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'http://localhost:3002'
const OUT_DIR = path.join(__dirname, '../docs/08-portfolio/gifs')
const AUTH_STATE = path.join(__dirname, '../.auth.json')
const DEMO_EMAIL = 'demo@cs-platform.dev'
const DEMO_PASSWORD = 'demo1234!'

async function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

// Login once headlessly and save session to .auth.json
async function saveAuthState() {
  console.log('🔐 Saving auth state...')
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  await page.goto(`${BASE_URL}/login`)
  await page.fill('input[type=email]', DEMO_EMAIL)
  await page.fill('input[type=password]', DEMO_PASSWORD)
  await page.click('button[type=submit]')
  await page.waitForURL(`${BASE_URL}/inbox`, { timeout: 10000 })
  await ctx.storageState({ path: AUTH_STATE })
  await browser.close()
  console.log('✅ Auth state saved')
}

async function newScene(
  name: string,
  authenticated = false
): Promise<{ ctx: BrowserContext; page: Page; close: () => Promise<void> }> {
  const browser = await chromium.launch({ headless: false, slowMo: 80 })
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ...(authenticated && fs.existsSync(AUTH_STATE) ? { storageState: AUTH_STATE } : {}),
    recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 800 } },
  })
  const page = await ctx.newPage()

  return {
    ctx,
    page,
    close: async () => {
      await ctx.close()
      await wait(500)
      const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.webm')).sort()
      const latest = files[files.length - 1]
      if (latest) {
        fs.renameSync(
          path.join(OUT_DIR, latest),
          path.join(OUT_DIR, `${name}.webm`)
        )
        console.log(`✅ ${name}.webm saved`)
      }
      await browser.close()
    },
  }
}

// Scene 01: 로그인 → 수신함 이동 (로그인 장면 의도적 포함)
async function scene01() {
  const { page, close } = await newScene('01-login-to-inbox')
  await page.goto(`${BASE_URL}/login`)
  await wait(1200)
  await page.fill('input[type=email]', DEMO_EMAIL)
  await wait(700)
  await page.fill('input[type=password]', DEMO_PASSWORD)
  await wait(700)
  await page.click('button[type=submit]')
  await page.waitForURL(`${BASE_URL}/inbox`, { timeout: 10000 })
  await wait(1500)
  await close()
}

// Scene 02: 수신함 티켓 목록 + 배지
async function scene02() {
  const { page, close } = await newScene('02-inbox-list', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(1000)
  await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'smooth' }))
  await wait(800)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  await wait(1500)
  await close()
}

// Scene 03: 상태 필터 (open → all → open)
async function scene03() {
  const { page, close } = await newScene('03-status-filter', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const allLink = page.locator('a', { hasText: '전체' }).first()
  await allLink.click()
  await wait(800)
  const openLink = page.locator('a', { hasText: '열림' }).first()
  await openLink.click()
  await wait(800)
  await close()
}

// Scene 04: 필터 빈 상태 (closed = 0)
async function scene04() {
  const { page, close } = await newScene('04-empty-state-filter', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const closedLink = page.locator('a', { hasText: '종료' }).first()
  await closedLink.click()
  await wait(1200)
  await wait(1500)
  await close()
}

// Scene 05: 티켓 클릭 → AI 분류 결과 + 신뢰도 배지
async function scene05() {
  const { page, close } = await newScene('05-ticket-detail-classification', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(1500)
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }))
  await wait(1200)
  await close()
}

// Scene 06: AI 초안 생성 → 초안 표시
async function scene06() {
  const { page, close } = await newScene('06-ai-draft-generate', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(1000)
  const generateBtn = page.locator('button').filter({ hasText: /AI 초안 생성|새 초안 생성/ }).first()
  await generateBtn.click()
  await wait(5000)
  await close()
}

// Scene 07: 1-click 승인 → queued + 카운트다운
async function scene07() {
  const { page, close } = await newScene('07-approve-queued', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  const generateBtn = page.locator('button').filter({ hasText: /AI 초안 생성|새 초안 생성/ }).first()
  if (await generateBtn.isVisible()) {
    await generateBtn.click()
    await wait(5000)
  }
  const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
  await approveBtn.click()
  await wait(2000)
  await wait(1500)
  await close()
}

// Scene 08: 발송 취소 → cancelled 상태
async function scene08() {
  const { page, close } = await newScene('08-cancel-draft', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  const generateBtn = page.locator('button').filter({ hasText: /AI 초안 생성|새 초안 생성/ }).first()
  if (await generateBtn.isVisible()) {
    await generateBtn.click()
    await wait(5000)
    const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
    await approveBtn.click()
    await wait(1500)
  }
  const cancelBtn = page.locator('button', { hasText: '발송 취소' }).first()
  await cancelBtn.click()
  await wait(1500)
  await close()
}

// Scene 09: 초안 편집 → 수정 후 승인
async function scene09() {
  const { page, close } = await newScene('09-edit-draft-approve', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const tickets = page.locator('a[href^="/inbox/"]')
  const count = await tickets.count()
  const target = tickets.nth(Math.min(1, count - 1))
  await target.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  // cancel any queued draft first
  const cancelExisting = page.locator('button', { hasText: '발송 취소' })
  if (await cancelExisting.isVisible({ timeout: 1500 }).catch(() => false)) {
    await cancelExisting.click()
    await wait(1000)
  }
  const generateBtn = page.locator('button').filter({ hasText: /AI 초안 생성|새 초안 생성/ }).first()
  if (await generateBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await generateBtn.click()
  }
  // wait for textarea to appear (draft generated)
  const textarea = page.locator('textarea').first()
  await textarea.waitFor({ state: 'visible', timeout: 15000 })
  await wait(500)
  await textarea.click()
  await wait(300)
  await textarea.press('End')
  await wait(300)
  await textarea.type('\n\n(수정됨 — 담당자 확인 후 발송)', { delay: 40 })
  await wait(800)
  const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
  await approveBtn.click()
  await wait(1500)
  await close()
}

// Scene 10: 재분류 → 새 카테고리·신뢰도 갱신
async function scene10() {
  const { page, close } = await newScene('10-reclassify', true)
  await page.goto(`${BASE_URL}/inbox`)
  await wait(800)
  const tickets = page.locator('a[href^="/inbox/"]')
  const count = await tickets.count()
  const target = tickets.nth(Math.min(2, count - 1))
  await target.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(1000)
  const reclassifyBtn = page.locator('button', { hasText: '재분류' }).first()
  await reclassifyBtn.click()
  await wait(4000)
  await close()
}

// Scene 11: 통합 여정 히어로 (로그인 의도적 포함)
async function scene11() {
  const { page, close } = await newScene('11-full-journey-hero')
  await page.goto(`${BASE_URL}/login`)
  await wait(800)
  await page.fill('input[type=email]', DEMO_EMAIL)
  await wait(500)
  await page.fill('input[type=password]', DEMO_PASSWORD)
  await wait(400)
  await page.click('button[type=submit]')
  await page.waitForURL(`${BASE_URL}/inbox`, { timeout: 10000 })
  await wait(1000)
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  const generateBtn = page.locator('button').filter({ hasText: /AI 초안 생성|새 초안 생성/ }).first()
  if (await generateBtn.isVisible()) {
    await generateBtn.click()
    await wait(6000)
  }
  const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
  await approveBtn.click()
  await wait(2000)
  await close()
}

async function main() {
  console.log('🎬 Re-recording scenes 02-10 without login...')
  await saveAuthState()

  await scene09()
  await scene10()

  console.log('\n✅ Done. Convert webm→GIF:')
  console.log('  cd docs/08-portfolio/gifs')
  console.log('  for f in 0{2..9}-*.webm 10-*.webm; do')
  console.log('    name="${f%.webm}"')
  console.log('    ffmpeg -i "$f" -vf "fps=10,scale=960:-1:flags=lanczos,palettegen" -y palette.png 2>/dev/null')
  console.log('    ffmpeg -i "$f" -i palette.png -filter_complex "fps=10,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" -y "$name.gif" 2>/dev/null')
  console.log('    rm -f palette.png')
  console.log('  done')
}

main().catch(console.error)
