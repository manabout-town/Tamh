/**
 * AI-AUTO CS Platform — Demo GIF Recording Script
 * Usage:
 *   1. npm run dev  (separate terminal)
 *   2. npx ts-node scripts/record-demo.ts
 *   3. cd docs/08-portfolio/gifs && for f in *.webm; do
 *        ffmpeg -i "$f" -vf "fps=12,scale=1280:-1:flags=lanczos,palettegen" -y palette.png
 *        ffmpeg -i "$f" -i palette.png -filter_complex "fps=12,scale=1280:-1:flags=lanczos[x];[x][1:v]paletteuse" -y "${f%.webm}.gif"
 *      done
 *
 * Demo account: sign up at http://localhost:3000/signup with any email/password
 * setup_demo() runs automatically on first signup → seeds 3 tickets
 */

import { chromium, type Page, type BrowserContext } from 'playwright'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'http://localhost:3002'
const OUT_DIR = path.join(__dirname, '../docs/08-portfolio/gifs')
const DEMO_EMAIL = 'demo@cs-platform.dev'
const DEMO_PASSWORD = 'demo1234!'

async function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function newScene(name: string): Promise<{ ctx: BrowserContext; page: Page; close: () => Promise<void> }> {
  const browser = await chromium.launch({ headless: false, slowMo: 80 })
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 800 } },
  })
  const page = await ctx.newPage()

  return {
    ctx,
    page,
    close: async () => {
      await ctx.close()
      // rename the latest .webm file
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

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`)
  await wait(800)
  await page.fill('input[type=email]', DEMO_EMAIL)
  await wait(600)
  await page.fill('input[type=password]', DEMO_PASSWORD)
  await wait(500)
  await page.click('button[type=submit]')
  await page.waitForURL(`${BASE_URL}/inbox`, { timeout: 10000 })
  await wait(1000)
}

// Scene 01: 로그인 → 수신함 이동
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
  const { page, close } = await newScene('02-inbox-list')
  await login(page)
  // slow scroll to show all tickets
  await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'smooth' }))
  await wait(800)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  await wait(1500)
  await close()
}

// Scene 03: 상태 필터 (open → all)
async function scene03() {
  const { page, close } = await newScene('03-status-filter')
  await login(page)
  await wait(500)
  // click "전체" (all)
  const allLink = page.locator('a', { hasText: '전체' }).first()
  await allLink.click()
  await wait(800)
  // click "열림" (open)
  const openLink = page.locator('a', { hasText: '열림' }).first()
  await openLink.click()
  await wait(800)
  await close()
}

// Scene 04: 필터 빈 상태 (closed tickets = 0)
async function scene04() {
  const { page, close } = await newScene('04-empty-state-filter')
  await login(page)
  await wait(500)
  const closedLink = page.locator('a', { hasText: '종료' }).first()
  await closedLink.click()
  await wait(1200)
  // show "필터 초기화" link
  await wait(1500)
  await close()
}

// Scene 05: 티켓 클릭 → AI 분류 결과 + 신뢰도 배지
async function scene05() {
  const { page, close } = await newScene('05-ticket-detail-classification')
  await login(page)
  await wait(500)
  // click first ticket
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(1500)
  // scroll to classification section
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }))
  await wait(1200)
  await close()
}

// Scene 06: AI 초안 생성 → 초안 표시
async function scene06() {
  const { page, close } = await newScene('06-ai-draft-generate')
  await login(page)
  await wait(500)
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(1000)
  // click "AI 초안 생성" button
  const generateBtn = page.locator('button', { hasText: 'AI 초안 생성' }).first()
  await generateBtn.click()
  // wait for draft to appear (API call)
  await wait(5000)
  await close()
}

// Scene 07: 1-click 승인 → queued + 5분 카운트다운
async function scene07() {
  const { page, close } = await newScene('07-approve-queued')
  await login(page)
  await wait(500)
  // find ticket that has a draft, or generate one first
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  // generate draft first
  const generateBtn = page.locator('button', { hasText: 'AI 초안 생성' })
  if (await generateBtn.isVisible()) {
    await generateBtn.click()
    await wait(5000)
  }
  // approve
  const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
  await approveBtn.click()
  await wait(2000)
  // show queued state with countdown
  await wait(1500)
  await close()
}

// Scene 08: 발송 취소 → cancelled 상태
async function scene08() {
  const { page, close } = await newScene('08-cancel-draft')
  await login(page)
  await wait(500)
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  // generate + approve to get queued state
  const generateBtn = page.locator('button', { hasText: 'AI 초안 생성' })
  if (await generateBtn.isVisible()) {
    await generateBtn.click()
    await wait(5000)
    const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
    await approveBtn.click()
    await wait(1500)
  }
  // cancel
  const cancelBtn = page.locator('button', { hasText: '발송 취소' }).first()
  await cancelBtn.click()
  await wait(1500)
  await close()
}

// Scene 09: 초안 편집 → 수정 후 승인
async function scene09() {
  const { page, close } = await newScene('09-edit-draft-approve')
  await login(page)
  await wait(500)
  // pick second ticket to have clean state
  const tickets = page.locator('a[href^="/inbox/"]')
  const count = await tickets.count()
  const target = tickets.nth(Math.min(1, count - 1))
  await target.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  const generateBtn = page.locator('button').filter({ hasText: /AI 초안 생성|새 초안 생성/ }).first()
  if (await generateBtn.isVisible()) {
    await generateBtn.click()
    await wait(6000)
  }
  // edit the textarea
  const textarea = page.locator('textarea').first()
  await textarea.click()
  await wait(500)
  await textarea.press('End')
  await wait(300)
  // add suffix
  await textarea.type('\n\n(수정됨 — 담당자 확인 후 발송)', { delay: 40 })
  await wait(800)
  const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
  await approveBtn.click()
  await wait(1500)
  await close()
}

// Scene 10: 재분류 → 새 분류 결과
async function scene10() {
  const { page, close } = await newScene('10-reclassify')
  await login(page)
  await wait(500)
  const tickets = page.locator('a[href^="/inbox/"]')
  const count = await tickets.count()
  const target = tickets.nth(Math.min(2, count - 1))
  await target.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(1000)
  const reclassifyBtn = page.locator('button', { hasText: '재분류' }).first()
  await reclassifyBtn.click()
  await wait(4000) // API call
  await close()
}

// Scene 11: 통합 여정 (히어로 GIF)
async function scene11() {
  const { page, close } = await newScene('11-full-journey-hero')
  // login
  await page.goto(`${BASE_URL}/login`)
  await wait(800)
  await page.fill('input[type=email]', DEMO_EMAIL)
  await wait(500)
  await page.fill('input[type=password]', DEMO_PASSWORD)
  await wait(400)
  await page.click('button[type=submit]')
  await page.waitForURL(`${BASE_URL}/inbox`, { timeout: 10000 })
  await wait(1000)
  // click first ticket
  const firstTicket = page.locator('a[href^="/inbox/"]').first()
  await firstTicket.click()
  await page.waitForURL(/\/inbox\/.+/, { timeout: 10000 })
  await wait(800)
  // generate draft
  const generateBtn = page.locator('button').filter({ hasText: /AI 초안 생성|새 초안 생성/ }).first()
  if (await generateBtn.isVisible()) {
    await generateBtn.click()
    await wait(6000)
  }
  // approve
  const approveBtn = page.locator('button', { hasText: '승인·발송' }).first()
  await approveBtn.click()
  await wait(2000)
  await close()
}

async function main() {
  console.log('🎬 Recording 11 scenes...')
  console.log('⚠️  Make sure npm run dev is running at http://localhost:3000')
  console.log('⚠️  Demo account must be created first (sign up at /signup)')
  console.log('')

  // Run scenes sequentially
  // scenes 01-09, 11 already recorded
  await scene10()

  console.log('')
  console.log('✅ All scenes recorded to docs/08-portfolio/gifs/')
  console.log('')
  console.log('Convert to GIF:')
  console.log(`  cd docs/08-portfolio/gifs`)
  console.log(`  for f in *.webm; do`)
  console.log(`    name="\${f%.webm}"`)
  console.log(`    ffmpeg -i "$f" -vf "fps=12,scale=1280:-1:flags=lanczos,palettegen" -y palette.png`)
  console.log(`    ffmpeg -i "$f" -i palette.png -filter_complex "fps=12,scale=1280:-1:flags=lanczos[x];[x][1:v]paletteuse" -y "$name.gif"`)
  console.log(`    rm palette.png`)
  console.log(`  done`)
}

main().catch(console.error)
