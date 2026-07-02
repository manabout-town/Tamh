/**
 * TÀMH — GIF 자동 촬영 스크립트
 * 실행: node scripts/record-gifs.js
 * 전제: 서버가 http://localhost:3000 에서 실행 중
 */

const { chromium } = require("playwright");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:3001";
const ADMIN_PIN = "0013";
const OUT_DIR = path.join(__dirname, "../docs/demo");
const TMP_DIR = path.join(__dirname, "../docs/demo/tmp");

const VIEWPORT = { width: 1194, height: 834 }; // iPad Pro 11"

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

function toGif(webmPath, gifPath, fps = 12, scale = 760) {
  const palette = webmPath.replace(".webm", "_palette.png");
  execSync(
    `ffmpeg -y -i "${webmPath}" -vf "fps=${fps},scale=${scale}:-1:flags=lanczos,palettegen" "${palette}"`
  );
  execSync(
    `ffmpeg -y -i "${webmPath}" -i "${palette}" -filter_complex "fps=${fps},scale=${scale}:-1:flags=lanczos[x];[x][1:v]paletteuse" "${gifPath}"`
  );
  fs.unlinkSync(palette);
  console.log(`✅  ${path.basename(gifPath)}`);
}

async function record(name, fn) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  const page = await ctx.newPage();
  try {
    await fn(page);
    await page.waitForTimeout(600);
  } finally {
    await ctx.close();
    await browser.close();
  }
  // 녹화된 webm 파일 찾기 (가장 최신)
  const files = fs.readdirSync(TMP_DIR).filter((f) => f.endsWith(".webm"));
  files.sort((a, b) => {
    return (
      fs.statSync(path.join(TMP_DIR, b)).mtimeMs -
      fs.statSync(path.join(TMP_DIR, a)).mtimeMs
    );
  });
  const webm = path.join(TMP_DIR, files[0]);
  const gif = path.join(OUT_DIR, `${name}.gif`);
  toGif(webm, gif);
  fs.unlinkSync(webm);
}

async function enterAdminMode(page) {
  // Lock button aria-label when not in admin mode
  await page.click('button[aria-label="관리자 잠금 해제"]');
  await page.waitForTimeout(400);
  // PinModal uses <input> elements, not buttons
  const inputs = page.locator('input[type="number"], input[inputmode="numeric"], input[maxlength="1"]');
  for (let i = 0; i < ADMIN_PIN.length; i++) {
    const input = inputs.nth(i);
    if (await input.count() > 0) {
      await input.click();
      await input.fill(ADMIN_PIN[i]);
      await page.waitForTimeout(120);
    }
  }
  await page.waitForTimeout(600);
}

// ─────────────────────────────────────────────
// 1. 메뉴판 + 탭 전환
// ─────────────────────────────────────────────
async function recordMenuBoard() {
  await record("menu-board", async (page) => {
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 탭 전환: 칵테일
    const tabs = page.locator('button:has-text("칵테일"), [data-tab="cocktail"]');
    if (await tabs.count() > 0) await tabs.first().click();
    await page.waitForTimeout(800);

    // 탭 전환: 푸드
    const foodTab = page.locator('button:has-text("푸드"), [data-tab="food"]');
    if (await foodTab.count() > 0) await foodTab.first().click();
    await page.waitForTimeout(800);

    // 다시 위스키
    const whiskyTab = page.locator('button:has-text("위스키"), [data-tab="whisky"]');
    if (await whiskyTab.count() > 0) await whiskyTab.first().click();
    await page.waitForTimeout(800);
  });
}

// ─────────────────────────────────────────────
// 2. 위클리 이벤트 섹션
// ─────────────────────────────────────────────
async function recordWeeklyEvent() {
  await record("weekly-event", async (page) => {
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    // Weekly Event 섹션으로 스크롤
    const weeklySection = page.locator("text=Weekly Event").first();
    if (await weeklySection.count() > 0) {
      await weeklySection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(1500);
  });
}

// ─────────────────────────────────────────────
// 3. 관리자 PIN + 인라인 가격 편집
// ─────────────────────────────────────────────
async function recordAdminEdit() {
  await record("admin-edit", async (page) => {
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 잠금 해제 버튼 클릭 → PIN 모달 오픈
    await page.click('button[aria-label="관리자 잠금 해제"]');
    await page.waitForTimeout(500);

    // PinModal: <input> 요소에 한 자리씩 입력
    const pinInputs = page.locator('input[maxlength="1"], input[inputmode="numeric"]');
    for (let i = 0; i < ADMIN_PIN.length; i++) {
      const inp = pinInputs.nth(i);
      if (await inp.count() > 0) {
        await inp.click();
        await inp.fill(ADMIN_PIN[i]);
        await page.waitForTimeout(150);
      }
    }
    await page.waitForTimeout(800);

    // 관리자 모드 진입 후 편집 UI 확인
    await page.waitForTimeout(600);
  });
}

// ─────────────────────────────────────────────
// 4. 품절 관리
// ─────────────────────────────────────────────
async function recordSoldout() {
  await record("soldout", async (page) => {
    await page.goto(`${BASE_URL}/soldout`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    // 토글 클릭 (있으면)
    const toggles = page.locator('button[role="switch"], input[type="checkbox"]');
    if (await toggles.count() > 0) {
      await toggles.first().click();
      await page.waitForTimeout(600);
      await toggles.first().click();
      await page.waitForTimeout(600);
    }
    await page.waitForTimeout(800);
  });
}

// ─────────────────────────────────────────────
// 5. 전체 검색
// ─────────────────────────────────────────────
async function recordSearch() {
  await record("search", async (page) => {
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    const searchInput = page.locator('input[type="search"], input[placeholder*="검색"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.click();
      await page.waitForTimeout(300);
      await searchInput.type("Glenfiddich", { delay: 80 });
      await page.waitForTimeout(800);
      await searchInput.selectText();
      await searchInput.type("Octomore", { delay: 80 });
      await page.waitForTimeout(800);
      await searchInput.clear();
      await page.waitForTimeout(500);
    }
  });
}

// ─────────────────────────────────────────────
// 6. 카테고리 필터
// ─────────────────────────────────────────────
async function recordCategoryFilter() {
  await record("category-filter", async (page) => {
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    const filters = ["Islay", "Highland", "Speyside", "Bourbon"];
    for (const f of filters) {
      const btn = page.locator(`button:has-text("${f}")`).first();
      if (await btn.count() > 0) {
        await btn.click();
        await page.waitForTimeout(500);
      }
    }
    await page.waitForTimeout(600);
  });
}

// ─────────────────────────────────────────────
// 7. 메뉴 추가 모달 (관리자 모드 필요)
// ─────────────────────────────────────────────
async function recordMenuAdd() {
  await record("menu-add", async (page) => {
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // 관리자 모드 진입
    const lockBtn = page.locator('button[aria-label="관리자 잠금 해제"]');
    if (await lockBtn.count() > 0) {
      await lockBtn.click();
      await page.waitForTimeout(500);
      const pinInputs = page.locator('input[maxlength="1"], input[inputmode="numeric"]');
      for (let i = 0; i < ADMIN_PIN.length; i++) {
        const inp = pinInputs.nth(i);
        if (await inp.count() > 0) { await inp.click(); await inp.fill(ADMIN_PIN[i]); await page.waitForTimeout(150); }
      }
      await page.waitForTimeout(700);
    }

    // 메뉴 추가 버튼
    const addBtn = page.locator('button:has-text("추가"), button:has-text("메뉴 추가"), button:has-text("+")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(600);
    }
    await page.waitForTimeout(1200);

    // 모달 닫기
    const closeBtn = page.locator('button:has-text("닫기"), button:has-text("취소"), button[aria-label*="close"]').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  });
}

// ─────────────────────────────────────────────
// 8. 태그 다중 필터 (/detail)
// ─────────────────────────────────────────────
async function recordTagFilter() {
  await record("tag-filter", async (page) => {
    await page.goto(`${BASE_URL}/detail`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const tags = ["피트·스모키 애호가", "셰리캐스크·단맛 선호", "한정판·희소가치 선호"];
    for (const tag of tags) {
      const btn = page.locator(`button:has-text("${tag}")`).first();
      if (await btn.count() > 0) {
        await btn.click();
        await page.waitForTimeout(500);
      }
    }
    await page.waitForTimeout(800);

    // 필터 해제
    const clearBtn = page.locator('button:has-text("초기화"), button:has-text("Clear"), button:has-text("전체")').first();
    if (await clearBtn.count() > 0) {
      await clearBtn.click();
      await page.waitForTimeout(500);
    }
  });
}

// ─────────────────────────────────────────────
// 9. 위스키 상세 + 유사 추천
// ─────────────────────────────────────────────
async function recordWhiskyDetail() {
  await record("whisky-detail", async (page) => {
    await page.goto(`${BASE_URL}/detail`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 첫 번째 위스키 카드 클릭
    const card = page.locator('[data-whisky], .whisky-card, article').first();
    if (await card.count() > 0) {
      await card.click();
      await page.waitForTimeout(800);
    }
    await page.waitForTimeout(1200);
  });
}

// ─────────────────────────────────────────────
// 실행
// ─────────────────────────────────────────────
(async () => {
  console.log("🎬 TÀMH GIF 촬영 시작...\n");

  const scenarios = [
    ["menu-board", recordMenuBoard],
    ["weekly-event", recordWeeklyEvent],
    ["admin-edit", recordAdminEdit],
    ["soldout", recordSoldout],
    ["search", recordSearch],
    ["category-filter", recordCategoryFilter],
    ["menu-add", recordMenuAdd],
    ["tag-filter", recordTagFilter],
    ["whisky-detail", recordWhiskyDetail],
  ];

  for (const [name, fn] of scenarios) {
    process.stdout.write(`🎥  ${name}... `);
    try {
      await fn();
    } catch (err) {
      console.log(`❌  오류: ${err.message}`);
    }
  }

  // tmp 정리
  try { fs.rmdirSync(TMP_DIR); } catch {}

  console.log("\n✅ 완료! docs/demo/ 에서 확인하세요.");
})();
