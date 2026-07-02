/**
 * TÀMH — Static in-memory DB (Supabase 제거 후 정적 데이터)
 * data.sql 기준으로 변환. 관리자 변경사항은 서버 재시작 전까지 메모리에 유지.
 */

import type { Category, Menu } from "@/types/database";

const NOW = new Date().toISOString();

function mid(n: number) {
  return `menu-${String(n).padStart(4, "0")}`;
}

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-001", name: "Signature",    priority: 0,   subtitle: "Weekly Event · This Week's Curated Picks", icon: "Sparkles",        created_at: NOW },
  { id: "cat-002", name: "Random Whisky",priority: 5,   subtitle: "바텐더의 블라인드 한 잔 (정답 시 1+1)",       icon: "Dices",           created_at: NOW },
  { id: "cat-010", name: "Highland",     priority: 10,  subtitle: "Single Malt · Scotland Highland",           icon: "Mountain",        created_at: NOW },
  { id: "cat-020", name: "Speyside",     priority: 20,  subtitle: "Single Malt · Speyside Region",             icon: "Trees",           created_at: NOW },
  { id: "cat-030", name: "Campbeltown",  priority: 30,  subtitle: "Single Malt · Campbeltown",                 icon: "Compass",         created_at: NOW },
  { id: "cat-040", name: "Islay",        priority: 40,  subtitle: "Single Malt · The Isle of Peat",            icon: "Waves",           created_at: NOW },
  { id: "cat-050", name: "Island",       priority: 50,  subtitle: "Single Malt · Island Region",               icon: "Anchor",          created_at: NOW },
  { id: "cat-060", name: "Blended",      priority: 60,  subtitle: "Blended Whisky",                            icon: "Layers",          created_at: NOW },
  { id: "cat-070", name: "Bourbon",      priority: 70,  subtitle: "American Whiskey & Bourbon",                icon: "Flame",           created_at: NOW },
  { id: "cat-080", name: "Japan",        priority: 80,  subtitle: "Japanese Whisky",                           icon: "Cherry",          created_at: NOW },
  { id: "cat-090", name: "Australia",    priority: 90,  subtitle: "Australian Whisky",                         icon: "Sun",             created_at: NOW },
  { id: "cat-091", name: "India",        priority: 95,  subtitle: "Indian Whisky",                             icon: "Flower",          created_at: NOW },
  { id: "cat-092", name: "Taiwan",       priority: 100, subtitle: "Taiwanese Whisky · Kavalan",                icon: "Leaf",            created_at: NOW },
  { id: "cat-100", name: "Brandy",       priority: 110, subtitle: "Brandy & Cognac",                           icon: "Wine",            created_at: NOW },
  { id: "cat-200", name: "Cocktail",     priority: 150, subtitle: "Bartender's Cocktails",                     icon: "GlassWater",      created_at: NOW },
  { id: "cat-210", name: "Food",         priority: 200, subtitle: "Side Dish · Pairing",                       icon: "UtensilsCrossed", created_at: NOW },
];

function m(
  id: string,
  categoryId: string,
  name: string,
  nameKo: string,
  price: number,
  bottlePrice: number | null,
  opts: {
    origin?: string | null;
    abv?: number | null;
    caskType?: string | null;
    isRecommended?: boolean;
    imageUrl?: string | null;
    description?: string | null;
    eventPrice?: number | null;
  } = {}
): Menu {
  return {
    id,
    category_id: categoryId,
    name,
    name_ko: nameKo,
    price,
    bottle_price: bottlePrice,
    event_price: opts.eventPrice ?? null,
    image_url: opts.imageUrl ?? null,
    origin: opts.origin ?? null,
    abv: opts.abv ?? null,
    cask_type: opts.caskType ?? null,
    is_active: true,
    is_recommended: opts.isRecommended ?? false,
    description: opts.description ?? null,
    created_at: NOW,
    updated_at: NOW,
  };
}

let _menuId = 1;
const nextId = () => mid(_menuId++);

export const SEED_MENUS: Menu[] = [
  // ── SIGNATURE / WEEKLY EVENT ──────────────────────────────────
  m(nextId(), "cat-001", "Royal Salute 21y (Weekly)",  "로얄살루트 21년 (30ml) — Weekly Event", 25000, 640000,  { origin: "Scotland · Blended", abv: 40,   caskType: "Sherry / Bourbon", isRecommended: true,  description: "21년의 시간이 잔에 부드럽게 내려앉는 한 잔. 36,000 → 25,000으로 만나보세요." }),
  m(nextId(), "cat-001", "Ballantine's 30y (Weekly)",  "발렌타인 30년 (30ml) — Weekly Event",   39000, 1200000, { origin: "Scotland · Blended", abv: 43,   caskType: "Blended",          isRecommended: true,  description: "30년의 깊이가 만들어낸 부드러움. 65,000 → 39,000." }),
  m(nextId(), "cat-001", "Octomore .1.2 (Weekly)",     "옥토모어 .1.2 (30ml) — Weekly Event",   39000, 1200000, { origin: "Islay",              abv: 59.1, caskType: "Ex-Bourbon",       isRecommended: true,  description: "극한의 피트와 우아한 단맛이 공존하는 한 잔. 55,000 → 39,000." }),
  m(nextId(), "cat-001", "Royal Brackla 21y (Weekly)", "로얄브라큘라 21 (30ml) — Weekly Event",  45000, 800000,  { origin: "Highland",           abv: 46,   caskType: "Sherry",           isRecommended: true,  description: "21년 셰리 캐스크 숙성의 따뜻한 한 잔. 65,000 → 45,000." }),
  m(nextId(), "cat-001", "Glenfiddich 23y (Weekly)",   "글렌피딕 23년 (30ml) — Weekly Event",   60000, 1350000, { origin: "Speyside",           abv: 43,   caskType: "Sherry Cask",      isRecommended: true,  description: "23년의 깊이가 만들어내는 다크 프룻과 우디 노트. 78,000 → 60,000." }),

  // ── RANDOM WHISKY ─────────────────────────────────────────────
  m(nextId(), "cat-002", "Random Whisky", "랜덤 위스키 (1+1 이벤트)", 10000, null, { origin: "Mystery", caskType: "Bartender's Pick", isRecommended: true, description: "바텐더가 이름을 알려주지 않고 드리는 한 잔. 1,2,3,4,5만원대 위스키 중 택 1. 정답을 맞추면 1+1." }),

  // ── HIGHLAND (37종) ───────────────────────────────────────────
  m(nextId(), "cat-010", "Dalmore 12y",               "달모어 12년",           18000, 300000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Dalmore 15y",               "달모어 15년",           32000, 640000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Dalmore 18y",               "달모어 18년",           48000, 740000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Dalmore CigarMalt",         "달모어 시가몰트",       32000, 640000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach 8y Hielan",     "글렌드로낙 8년 히란",   20000, 340000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach 12y",           "글렌드로낙 12년",       19000, 290000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach 15y",           "글렌드로낙 15년",       30000, 560000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach 16y",           "글렌드로낙 16년",       45000, 800000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach 21y",           "글렌드로낙 21년",       60000, 1200000, { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach Peated",        "글렌드로낙 피티드",     20000, 320000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach PortWood",      "글렌드로낙 포트우드",   26000, 450000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach CS",            "글렌드로낙 CS",         33000, 590000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glendronach 2008",          "글렌드로낙 2008",       60000, 1200000, { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenmorangie Original",     "글렌모렌지 오리지날",   15000, 250000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenmorangie Lasanta",      "글렌모렌지 라산타",     18000, 290000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenmorangie Nectar D'Or",  "글렌모렌지 더 넥타",    25000, 380000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenmorangie Quinta Ruban", "글렌모렌지 퀸타루반",   21000, 340000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenmorangie Signet",       "글렌모렌지 시그넷",     42000, 780000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glengoyne 12y",             "글렌고인 12년",         18000, 300000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glengoyne 15y",             "글렌고인 15년",         24000, 420000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glengoyne 18y",             "글렌고인 18년",         36000, 640000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas 8y",            "글렌파클라스 8년",      16000, 300000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas 10y",           "글렌파클라스 10년",     18000, 320000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas 12y",           "글렌파클라스 12년",     19000, 340000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas 15y",           "글렌파클라스 15년",     23000, 380000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas 25y",           "글렌파클라스 25년",     60000, 900000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas 12y CS",        "글렌파클라스 12년 CS",  30000, 540000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas 105 CS",        "글렌파클라스 105 CS",   23000, 400000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Glenfarclas Family 2000",   "글렌파클라스 패밀리 2000", 60000, 1200000, { origin: "Highland" }),
  m(nextId(), "cat-010", "Oban 14y",                  "오반 14년",             19000, 340000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Old Pulteney 12y",          "올드 풀티니 12년",      15000, 250000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Tomatin 12y",               "토마틴 12년",           16000, 250000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Tomatin 15y",               "토마틴 15년",           19000, 330000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "AnCnoc 12y",                "아녹 12년",             15000, 250000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Balblair 12y",              "발블레어 12년",         17000, 320000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Dalwhinnie 15y",            "달위니 15년",           16000, 290000,  { origin: "Highland" }),
  m(nextId(), "cat-010", "Deanston 12y",              "딘스톤 12년",           14000, 250000,  { origin: "Highland" }),

  // ── SPEYSIDE (50종) ───────────────────────────────────────────
  m(nextId(), "cat-020", "Aberlour Double Cask 12y",          "아벨라워 더블캐스크 12년",     17000, 290000,  { origin: "Speyside", caskType: "Double Cask" }),
  m(nextId(), "cat-020", "Aberlour Double Cask 14y",          "아벨라워 더블캐스크 14년",     26000, 480000,  { origin: "Speyside", caskType: "Double Cask" }),
  m(nextId(), "cat-020", "Aberlour A'bunadh",                 "아벨라워 아부나흐",             28000, 520000,  { origin: "Speyside", caskType: "Sherry CS" }),
  m(nextId(), "cat-020", "Balvenie DoubleWood 12y",           "발베니 더블우드 12년",          18000, 320000,  { origin: "Speyside", caskType: "Bourbon / Sherry" }),
  m(nextId(), "cat-020", "Balvenie Single Barrel 12y",        "발베니 싱글배럴 12년",          23000, 380000,  { origin: "Speyside", caskType: "Single Barrel" }),
  m(nextId(), "cat-020", "Balvenie Week of Peat 14y",         "발베니 위크오브피트 14년",      29000, 540000,  { origin: "Speyside", caskType: "Peated" }),
  m(nextId(), "cat-020", "Balvenie Caribbean Cask 14y",       "발베니 캐리비안 캐스크 14년",   25000, 490000,  { origin: "Speyside", caskType: "Rum Cask" }),
  m(nextId(), "cat-020", "Balvenie Madeira Cask 15y",         "발베니 마데이라 캐스크 15년",   29000, 540000,  { origin: "Speyside", caskType: "Madeira" }),
  m(nextId(), "cat-020", "Balvenie Single Barrel 15y Sherry", "발베니 15 싱글배럴 셰리",       60000, 1200000, { origin: "Speyside", caskType: "Sherry Single Barrel", isRecommended: true }),
  m(nextId(), "cat-020", "Balvenie French Oak 16y",           "발베니 16 프렌치오크",          45000, 800000,  { origin: "Speyside", caskType: "French Oak" }),
  m(nextId(), "cat-020", "Balvenie PX Cask 18y",              "발베니 PX캐스크 18년",          50000, 950000,  { origin: "Speyside", caskType: "PX Cask", isRecommended: true }),
  m(nextId(), "cat-020", "Balvenie 19 Week of Peat",          "발베니 19년 위크오브피트",      50000, 950000,  { origin: "Speyside", caskType: "Peated" }),
  m(nextId(), "cat-020", "Balvenie Portwood Cask 21y",        "발베니 포트우드 캐스크 21년",   68000, 1200000, { origin: "Speyside", caskType: "Port Wood", isRecommended: true }),
  m(nextId(), "cat-020", "Balvenie Madeira Cask 21y",         "발베니 마데이라 캐스크 21년",   68000, 1200000, { origin: "Speyside", caskType: "Madeira", isRecommended: true }),
  m(nextId(), "cat-020", "Glenfiddich 12y",                   "글렌피딕 12년",                 16000, 290000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glenfiddich 15y",                   "글렌피딕 15년",                 20000, 400000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glenfiddich 18y",                   "글렌피딕 18년",                 32000, 580000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glenfiddich 21y",                   "글렌피딕 21년",                 52000, 930000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glenfiddich 23y",                   "글렌피딕 23년",                 78000, 1350000, { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glen Grant 10y",                    "글렌그란트 10년",               12000, 180000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glen Grant 12y",                    "글렌그란트 12년",               16000, 290000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glen Grant 15y",                    "글렌그란트 15년",               19000, 340000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glen Grant 18y",                    "글렌그란트 18년",               30000, 550000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "GlenAllachie 10y CS",               "글렌알라키 10년 CS",            29000, 550000,  { origin: "Speyside", caskType: "Cask Strength" }),
  m(nextId(), "cat-020", "GlenAllachie 12y",                  "글렌알라키 12년",               23000, 390000,  { origin: "Speyside", caskType: "Sherry / PX" }),
  m(nextId(), "cat-020", "GlenAllachie 13y",                  "글렌알라키 13년",               25000, 480000,  { origin: "Speyside", caskType: "Sherry" }),
  m(nextId(), "cat-020", "GlenAllachie 15y",                  "글렌알라키 15년",               29000, 550000,  { origin: "Speyside", caskType: "Sherry / PX" }),
  m(nextId(), "cat-020", "GlenAllachie 18y",                  "글렌알라키 18년",               47000, 850000,  { origin: "Speyside", caskType: "Sherry" }),
  m(nextId(), "cat-020", "GlenAllachie Cuvée Cask",           "글렌알라키 쿠베 캐스크",        24000, 400000,  { origin: "Speyside", caskType: "Cuvée" }),
  m(nextId(), "cat-020", "GlenAllachie Sinteis 2015",         "글렌알라키 신테이스 2015",      35000, 650000,  { origin: "Speyside", caskType: "Single Cask" }),
  m(nextId(), "cat-020", "Glenrothes 12y",                    "글렌로티스 12년",               15000, 270000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glenrothes WMC",                    "글렌로티스 WMC",                24000, 400000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glenrothes 18y",                    "글렌로티스 18년",               32000, 550000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Glenlivet 12y",                     "글렌리벳 12년",                 16000, 280000,  { origin: "Speyside", caskType: "Bourbon" }),
  m(nextId(), "cat-020", "Glenlivet 13y CS",                  "글렌리벳 13년 CS",              47000, 850000,  { origin: "Speyside", caskType: "Cask Strength" }),
  m(nextId(), "cat-020", "Glenlivet 15y",                     "글렌리벳 15년",                 20000, 350000,  { origin: "Speyside", caskType: "French Oak" }),
  m(nextId(), "cat-020", "Glenlivet 16y Nadurra CS",          "글렌리벳 나두라 16년 CS",       48000, 850000,  { origin: "Speyside", caskType: "Sherry CS" }),
  m(nextId(), "cat-020", "Glenlivet 18y",                     "글렌리벳 18년",                 32000, 580000,  { origin: "Speyside", caskType: "Sherry / Bourbon" }),
  m(nextId(), "cat-020", "Macallan Double Cask 12y",          "맥켈란 더블캐스크 12년",        18000, 320000,  { origin: "Speyside", caskType: "Double Cask" }),
  m(nextId(), "cat-020", "Macallan Triple Cask 12y",          "맥켈란 트리플캐스크 12년",      19000, 340000,  { origin: "Speyside", caskType: "Triple Cask" }),
  m(nextId(), "cat-020", "Macallan Sherry Cask 12y",          "맥켈란 셰리캐스크 12년",        19000, 340000,  { origin: "Speyside", caskType: "Sherry Cask" }),
  m(nextId(), "cat-020", "Macallan Double Cask 15y",          "맥켈란 더블캐스크 15년",        30000, 550000,  { origin: "Speyside", caskType: "Double Cask" }),
  m(nextId(), "cat-020", "Macallan Triple Cask 15y",          "맥켈란 트리플캐스크 15년",      30000, 550000,  { origin: "Speyside", caskType: "Triple Cask" }),
  m(nextId(), "cat-020", "Macallan Double Cask 18y",          "맥켈란 더블캐스크 18년",        53000, 1100000, { origin: "Speyside", caskType: "Double Cask", isRecommended: true }),
  m(nextId(), "cat-020", "Macallan Sherry Cask 18y",          "맥켈란 셰리캐스크 18년",        60000, 1200000, { origin: "Speyside", caskType: "Sherry Cask", isRecommended: true }),
  m(nextId(), "cat-020", "Monkey Shoulder",                   "몽키 숄더",                     12000, 180000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Speyburn 10y",                      "스페이번 10년",                  12000, 180000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "BenRiach 12y",                      "벤리악 12년",                   16000, 270000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Benromach 10y",                     "벤로막 10년",                   16000, 290000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "Cragganmore 12y",                   "크라겐모어 12년",               15000, 270000,  { origin: "Speyside" }),
  m(nextId(), "cat-020", "The Singleton Dufftown 12y",        "싱글톤 더프타운 12년",          14000, 250000,  { origin: "Speyside" }),

  // ── CAMPBELTOWN (3종) ────────────────────────────────────────
  m(nextId(), "cat-030", "Springbank 10y", "스프링뱅크 10년", 38000, 740000,  { origin: "Campbeltown", abv: 46, isRecommended: true }),
  m(nextId(), "cat-030", "Springbank 15y", "스프링뱅크 15년", 58000, 1200000, { origin: "Campbeltown", abv: 46, isRecommended: true }),
  m(nextId(), "cat-030", "Kilkerran 12y",  "킬커란 12년",     31000, 570000,  { origin: "Campbeltown", abv: 46 }),

  // ── ISLAY (33종) ─────────────────────────────────────────────
  m(nextId(), "cat-040", "Ardbeg Wee Beastie",    "아드벡 위비스티",        14000, 240000,  { origin: "Islay", abv: 47.4 }),
  m(nextId(), "cat-040", "Ardbeg Smoketrails",    "아드벡 스모크트레일스",  18000, 300000,  { origin: "Islay", abv: 46 }),
  m(nextId(), "cat-040", "Ardbeg 10y",            "아드벡 10년",            18000, 290000,  { origin: "Islay", abv: 46, isRecommended: true }),
  m(nextId(), "cat-040", "Ardbeg Anthology 13y",  "아드벡 앤솔로지 13년",   36000, 720000,  { origin: "Islay", abv: 46 }),
  m(nextId(), "cat-040", "Ardbeg Smokiverse",     "아드벡 스모키버스",      30000, 600000,  { origin: "Islay", abv: 46.5 }),
  m(nextId(), "cat-040", "Ardbeg An Oa",          "아드벡 안 오",            19000, 320000,  { origin: "Islay", abv: 46.6 }),
  m(nextId(), "cat-040", "Ardbeg Uigeadail",      "아드벡 우거다일",        25000, 400000,  { origin: "Islay", abv: 54.2, isRecommended: true }),
  m(nextId(), "cat-040", "Ardbeg Corryvreckan",   "아드벡 코리브레칸",      29000, 550000,  { origin: "Islay", abv: 57.1, isRecommended: true }),
  m(nextId(), "cat-040", "Bowmore 12y",           "보모어 12년",             17000, 290000,  { origin: "Islay", abv: 40 }),
  m(nextId(), "cat-040", "Bowmore 15y",           "보모어 15년",             22000, 400000,  { origin: "Islay", abv: 43 }),
  m(nextId(), "cat-040", "Bowmore 18y A/M",       "보모어 애스톤마틴 18년",  39000, 900000,  { origin: "Islay", abv: 43, isRecommended: true }),
  m(nextId(), "cat-040", "Caol Ila 12y",          "쿨일라 12년",             16000, 280000,  { origin: "Islay", abv: 43 }),
  m(nextId(), "cat-040", "Caol Ila DE",           "쿨일라 DE",               19000, 320000,  { origin: "Islay", abv: 43 }),
  m(nextId(), "cat-040", "Caol Ila 25y",          "쿨일라 25년",             80000, 1400000, { origin: "Islay", abv: 43 }),
  m(nextId(), "cat-040", "Kilchoman Sanaig",      "킬호만 사닉",             20000, 360000,  { origin: "Islay", abv: 46 }),
  m(nextId(), "cat-040", "Kilchoman Machir Bay",  "킬호만 마키어 베이",      21000, 360000,  { origin: "Islay", abv: 46 }),
  m(nextId(), "cat-040", "Kilchoman Loch Gorm",   "킬호만 로크 곰",          33000, 360000,  { origin: "Islay", abv: 46 }),
  m(nextId(), "cat-040", "Talisker 8y SR",        "탈리스커 SR 8년",         19000, 320000,  { origin: "Islay", abv: 57.9 }),
  m(nextId(), "cat-040", "Talisker 10y",          "탈리스커 10년",           16000, 260000,  { origin: "Islay", abv: 45.8 }),
  m(nextId(), "cat-040", "Talisker Port Ruighe",  "탈리스커 포트뤼",         20000, 370000,  { origin: "Islay", abv: 45.8 }),
  m(nextId(), "cat-040", "Talisker 18y",          "탈리스커 18년",           45000, 900000,  { origin: "Islay", abv: 45.8 }),
  m(nextId(), "cat-040", "Bunnahabhain 12y",      "부나하벤 12년",           18000, 300000,  { origin: "Islay", abv: 46.3 }),
  m(nextId(), "cat-040", "Bunnahabhain 12y CS",   "부나하벤 12년 CS",        40000, 700000,  { origin: "Islay", abv: 55.1 }),
  m(nextId(), "cat-040", "Bruichladdich Port Charlotte", "브룩라디 포트샬롯", 20000, 360000,  { origin: "Islay", abv: 50 }),
  m(nextId(), "cat-040", "Lagavulin 8y",          "라가불린 8년",             17000, 290000,  { origin: "Islay", abv: 48 }),
  m(nextId(), "cat-040", "Lagavulin 16y",         "라가불린 16년",            24000, 400000,  { origin: "Islay", abv: 43, isRecommended: true }),
  m(nextId(), "cat-040", "Laphroaig Oak Select",  "라프로익 오크셀렉트",     16000, 270000,  { origin: "Islay", abv: 40 }),
  m(nextId(), "cat-040", "Laphroaig 10y",         "라프로익 10년",            18000, 290000,  { origin: "Islay", abv: 40 }),
  m(nextId(), "cat-040", "Laphroaig Quarter Cask","라프로익 쿼터캐스크",     18000, 290000,  { origin: "Islay", abv: 48 }),
  m(nextId(), "cat-040", "Laphroaig PX",          "라프로익 PX",              18000, 400000,  { origin: "Islay", abv: 48 }),
  m(nextId(), "cat-040", "Laphroaig Lore",        "라프로익 로어",            33000, 800000,  { origin: "Islay", abv: 48, isRecommended: true }),
  m(nextId(), "cat-040", "Octomore 14.1",         "옥토모어 14.1",            55000, 1200000, { origin: "Islay", abv: 59.1, isRecommended: true }),
  m(nextId(), "cat-040", "Octomore 14.2",         "옥토모어 14.2",            55000, 1200000, { origin: "Islay", abv: 57.3, isRecommended: true }),

  // ── ISLAND (11종) ─────────────────────────────────────────────
  m(nextId(), "cat-050", "Arran 10y",                    "아란 10년",                  16000, 270000, { origin: "Island", abv: 46 }),
  m(nextId(), "cat-050", "Arran Barrel Reserve Malt",    "아란 베럴 리저브 몰트",      16000, 270000, { origin: "Island", abv: 43 }),
  m(nextId(), "cat-050", "Arran Quarter Cask",           "아란 쿼터 캐스크",           20000, 360000, { origin: "Island", abv: 56.2 }),
  m(nextId(), "cat-050", "Arran Sauternes Cask Finish",  "아란 소테른 캐스크 피니쉬",  24000, 420000, { origin: "Island", abv: 50 }),
  m(nextId(), "cat-050", "Arran Port Cask Finish",       "아란 포트 캐스크 피니쉬",    23000, 400000, { origin: "Island", abv: 50 }),
  m(nextId(), "cat-050", "Arran Amarone Cask Finish",    "아란 아마로네 캐스크 피니쉬",23000, 400000, { origin: "Island", abv: 50 }),
  m(nextId(), "cat-050", "Arran Sherry Cask",            "아란 셰리 캐스크",           26000, 540000, { origin: "Island", abv: 55.8 }),
  m(nextId(), "cat-050", "Arran Machrie Moor CS",        "아란 마크리무어 CS",          25000, 500000, { origin: "Island", abv: 56.2 }),
  m(nextId(), "cat-050", "Highland Park 12y",            "하일랜드 파크 12년",          18000, 320000, { origin: "Island", abv: 40 }),
  m(nextId(), "cat-050", "Highland Park 15y",            "하일랜드 파크 15년",          25000, 500000, { origin: "Island", abv: 40 }),
  m(nextId(), "cat-050", "Highland Park 16y",            "하일랜드 파크 16년",          25000, 500000, { origin: "Island", abv: 40 }),

  // ── BLENDED (15종) ───────────────────────────────────────────
  m(nextId(), "cat-060", "Ballantine's 12y",              "발렌타인 12년",          13000, 180000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Ballantine's 17y",              "발렌타인 17년",          23000, 380000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Ballantine's 21y",              "발렌타인 21년",          31000, 560000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Ballantine's 30y",              "발렌타인 30년",          55000, 1200000, { origin: "Scotland", abv: 43, isRecommended: true }),
  m(nextId(), "cat-060", "Dewar's 12y",                   "듀어스 12년",            14000, 190000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Dewar's 15y",                   "듀어스 15년",            16000, 210000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Dewar's 18y",                   "듀어스 18년",            21000, 340000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Johnnie Walker Black Label",     "조니워커 블랙라벨",      12000, 180000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Johnnie Walker Black Label Old", "조니워커 블랙라벨 올드", 30000, 560000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Johnnie Walker Green Label",     "조니워커 그린라벨",      16000, 260000,  { origin: "Scotland", abv: 43 }),
  m(nextId(), "cat-060", "Johnnie Walker Gold Label",      "조니워커 골드라벨",      16000, 260000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Johnnie Walker Blue Label",      "조니워커 블루라벨",      36000, 640000,  { origin: "Scotland", abv: 40, isRecommended: true }),
  m(nextId(), "cat-060", "Royal Salute 21y",               "로얄 살루트 21년",       36000, 640000,  { origin: "Scotland", abv: 40 }),
  m(nextId(), "cat-060", "Royal Salute 25y",               "로얄 살루트 25년",       70000, 1200000, { origin: "Scotland", abv: 40, isRecommended: true }),
  m(nextId(), "cat-060", "Royal Salute 32y",               "로얄 살루트 32년",       100000, 1800000,{ origin: "Scotland", abv: 40, isRecommended: true }),

  // ── BOURBON (25종) ───────────────────────────────────────────
  m(nextId(), "cat-070", "Shenk's 2022",                    "쉥크스 2022",              50000, 1200000, { origin: "Kentucky",  abv: 45.6,  isRecommended: true }),
  m(nextId(), "cat-070", "Buffalo Trace",                    "버팔로 트레이스",           13000, 200000,  { origin: "Kentucky",  abv: 45 }),
  m(nextId(), "cat-070", "Jack Daniel Single Barrel",        "잭다니엘 싱글배럴",         18000, 300000,  { origin: "Tennessee", abv: 47 }),
  m(nextId(), "cat-070", "Knob Creek 9y",                    "놉크릭 9년",               15000, 250000,  { origin: "Kentucky",  abv: 50 }),
  m(nextId(), "cat-070", "1792 Small Batch",                 "1792 스몰배치",             15000, 250000,  { origin: "Kentucky",  abv: 46.85 }),
  m(nextId(), "cat-070", "Russell's Reserve 10y",            "러셀 리저브 10년",          15000, 280000,  { origin: "Kentucky",  abv: 45 }),
  m(nextId(), "cat-070", "Russell's Reserve Single Barrel",  "러셀 리저브 싱글배럴",      17000, 290000,  { origin: "Kentucky",  abv: 55 }),
  m(nextId(), "cat-070", "Russell's Reserve Rye",            "러셀 리저브 라이",          18000, 290000,  { origin: "Kentucky",  abv: 52.5 }),
  m(nextId(), "cat-070", "Four Roses Small Batch",           "포 로지스 스몰배치",        16000, 260000,  { origin: "Kentucky",  abv: 45 }),
  m(nextId(), "cat-070", "1776 James E. Pepper Bourbon",     "1776 제임스 E 페퍼 버번",   19000, 330000,  { origin: "Kentucky",  abv: 46 }),
  m(nextId(), "cat-070", "Rowan's Creek",                    "로완스 크릭",               19000, 330000,  { origin: "Kentucky",  abv: 50.05 }),
  m(nextId(), "cat-070", "Woodford Reserve",                 "우드포드 리저브",           17000, 290000,  { origin: "Kentucky",  abv: 45.2 }),
  m(nextId(), "cat-070", "Woodford Reserve Rye",             "우드포드 리저브 라이",      17000, 290000,  { origin: "Kentucky",  abv: 45.2 }),
  m(nextId(), "cat-070", "Noah's Mill",                      "노아스 밀",                 25000, 480000,  { origin: "Kentucky",  abv: 57.15 }),
  m(nextId(), "cat-070", "Booker's 2022",                    "부커스 2022",               35000, 700000,  { origin: "Kentucky",  abv: 62.6, isRecommended: true }),
  m(nextId(), "cat-070", "Town Branch Bourbon",              "타운 브렌치 버번",          18000, 290000,  { origin: "Kentucky",  abv: 40 }),
  m(nextId(), "cat-070", "Town Branch Rye",                  "타운 브렌치 라이",          18000, 290000,  { origin: "Kentucky",  abv: 50 }),
  m(nextId(), "cat-070", "VHW Port Cask",                    "VHW 포트캐스크",            19000, 320000,  { origin: "Virginia",  abv: 46 }),
  m(nextId(), "cat-070", "Wild Turkey 8y",                   "와일드터키 8년",            15000, 250000,  { origin: "Kentucky",  abv: 50.5 }),
  m(nextId(), "cat-070", "Wild Turkey Rare Breed",           "와일드터키 레어브리드",     20000, 400000,  { origin: "Kentucky",  abv: 58.4, isRecommended: true }),
  m(nextId(), "cat-070", "Maker's Mark",                     "메이커스 마크",             13000, 220000,  { origin: "Kentucky",  abv: 45 }),
  m(nextId(), "cat-070", "Maker's Mark CS",                  "메이커스 마크 CS",          20000, 360000,  { origin: "Kentucky",  abv: 54, isRecommended: true }),
  m(nextId(), "cat-070", "Michter's Sour Mash",              "믹터스 사워 매시",          19000, 320000,  { origin: "Kentucky",  abv: 43 }),
  m(nextId(), "cat-070", "Michter's Small Batch",            "믹터스 스몰 배치",          17000, 280000,  { origin: "Kentucky",  abv: 45.7 }),
  m(nextId(), "cat-070", "Michter's Unblended",              "믹터스 언블렌디드",         17000, 280000,  { origin: "Kentucky",  abv: 41.7 }),

  // ── JAPAN (11종) ─────────────────────────────────────────────
  m(nextId(), "cat-080", "Suntory Yamazaki DR",           "산토리 야마자키 DR",          26000, 450000,  { origin: "Japan", abv: 43 }),
  m(nextId(), "cat-080", "Suntory Yamazaki 12y",          "산토리 야마자키 12년",         39000, 790000,  { origin: "Japan", abv: 43, isRecommended: true }),
  m(nextId(), "cat-080", "Suntory Yamazaki Smoky Batch",  "산토리 야마자키 스모키 배치",  39000, 790000,  { origin: "Japan", abv: 48 }),
  m(nextId(), "cat-080", "Hakushu DR",                    "하쿠슈 DR",                    26000, 450000,  { origin: "Japan", abv: 43 }),
  m(nextId(), "cat-080", "Hakushu Bittersweet",           "하쿠슈 비터스윗",              39000, 790000,  { origin: "Japan", abv: 48 }),
  m(nextId(), "cat-080", "Hibiki Harmony",                "히비키 하모니",                29000, 540000,  { origin: "Japan", abv: 43 }),
  m(nextId(), "cat-080", "Hibiki 21",                     "히비키 21년",                  120000, 1500000,{ origin: "Japan", abv: 43, isRecommended: true }),
  m(nextId(), "cat-080", "Hibiki Master Select",          "히비키 마스터 셀렉트",         31000, 540000,  { origin: "Japan", abv: 43 }),
  m(nextId(), "cat-080", "Hibiki Blender's Choice",       "히비키 블렌더스 초이스",       31000, 540000,  { origin: "Japan", abv: 43 }),
  m(nextId(), "cat-080", "Yoichi",                        "요이치",                        29000, 500000,  { origin: "Japan", abv: 45 }),
  m(nextId(), "cat-080", "Yoichi Miyagikyo",              "요이치 미야기쿄",               35000, 600000,  { origin: "Japan", abv: 45 }),

  // ── AUSTRALIA (3종) ──────────────────────────────────────────
  m(nextId(), "cat-090", "Starward Nova",   "스타워드 노바",   18000, 320000, { origin: "Australia", abv: 41 }),
  m(nextId(), "cat-090", "Starward Fortis", "스타워드 포티스", 21000, 400000, { origin: "Australia", abv: 50 }),
  m(nextId(), "cat-090", "Starward Solera", "스타워드 솔레라", 22000, 400000, { origin: "Australia", abv: 43 }),

  // ── INDIA (3종) ──────────────────────────────────────────────
  m(nextId(), "cat-091", "Amrut Indian", "암룻 인디안", 16000, 250000, { origin: "India", abv: 46 }),
  m(nextId(), "cat-091", "Amrut Peated", "암룻 피티드", 18000, 290000, { origin: "India", abv: 46 }),
  m(nextId(), "cat-091", "Amrut Fusion", "암룻 퓨젼",   20000, 320000, { origin: "India", abv: 50 }),

  // ── TAIWAN / Kavalan Solist (10종) ───────────────────────────
  m(nextId(), "cat-092", "Kavalan Solist Vinho Barrique", "카발란 솔리스트 비노바리끄", 34000, 640000,  { origin: "Taiwan", abv: 57.8, caskType: "Vinho Barrique" }),
  m(nextId(), "cat-092", "Kavalan Solist Ex-Bourbon",     "카발란 솔리스트 엑스 버번",  34000, 640000,  { origin: "Taiwan", abv: 57.8, caskType: "Ex-Bourbon" }),
  m(nextId(), "cat-092", "Kavalan Solist Port",           "카발란 솔리스트 포트",       34000, 640000,  { origin: "Taiwan", abv: 57.8, caskType: "Port Cask" }),
  m(nextId(), "cat-092", "Kavalan Solist Brandy",         "카발란 솔리스트 브랜디",     38000, 720000,  { origin: "Taiwan", abv: 57.8, caskType: "Brandy Cask" }),
  m(nextId(), "cat-092", "Kavalan Solist Peated",         "카발란 솔리스트 피티드",     45000, 720000,  { origin: "Taiwan", abv: 57.8, caskType: "Peated" }),
  m(nextId(), "cat-092", "Kavalan Solist Oloroso Sherry", "카발란 솔리스트 올로로소",   58000, 1200000, { origin: "Taiwan", abv: 57.8, caskType: "Oloroso Sherry", isRecommended: true }),
  m(nextId(), "cat-092", "Kavalan Solist Madeira",        "카발란 솔리스트 마데이라",   49000, 1200000, { origin: "Taiwan", abv: 57.8, caskType: "Madeira" }),
  m(nextId(), "cat-092", "Kavalan Solist PX",             "카발란 솔리스트 PX",         60000, 1200000, { origin: "Taiwan", abv: 57.8, caskType: "PX Sherry", isRecommended: true }),
  m(nextId(), "cat-092", "Kavalan Solist Moscatel",       "카발란 솔리스트 모스카텔",   65000, 1300000, { origin: "Taiwan", abv: 57.8, caskType: "Moscatel", isRecommended: true }),
  m(nextId(), "cat-092", "Kavalan Solist Fino",           "카발란 솔리스트 피노",       70000, 1500000, { origin: "Taiwan", abv: 57.8, caskType: "Fino Sherry", isRecommended: true }),

  // ── BRANDY (5종) ─────────────────────────────────────────────
  m(nextId(), "cat-100", "Hennessy VSOP",   "헤네시 VSOP",  18000, 290000, { origin: "France · Cognac", abv: 40 }),
  m(nextId(), "cat-100", "Hennessy X.O",    "헤네시 XO",    42000, 900000, { origin: "France · Cognac", abv: 40, isRecommended: true }),
  m(nextId(), "cat-100", "Camus VSOP",      "까뮤 VSOP",    17000, 280000, { origin: "France · Cognac", abv: 40 }),
  m(nextId(), "cat-100", "Camus X.O",       "까뮤 XO",      25000, 450000, { origin: "France · Cognac", abv: 40 }),
  m(nextId(), "cat-100", "Remy Martin X.O", "레미마틴 XO",  36000, 600000, { origin: "France · Cognac", abv: 40, isRecommended: true }),

  // ── COCKTAIL (17종) ──────────────────────────────────────────
  m(nextId(), "cat-200", "Godfather",             "갓파더",            16000, null, { origin: "Cocktail", abv: 33,  imageUrl: "https://cdn.imweb.me/thumbnail/20240609/f8fa6c5070965.jpg",  description: "Bourbon · Disaronno 등. 33% — 묵직한 단맛과 아몬드의 깊이.", isRecommended: true }),
  m(nextId(), "cat-200", "Cherry Old Fashioned",  "체리 올드패션드",   16000, null, { origin: "Cocktail", abv: 26,  imageUrl: "https://cdn.imweb.me/thumbnail/20240609/b999cc178d4f4.jpg",  description: "Bourbon · Angostura 등. 26% — 체리 향이 더해진 고전적 한 잔.", isRecommended: true }),
  m(nextId(), "cat-200", "Wild Flower Julep",     "와일드 플라워 쥴렙",16000, null, { origin: "Cocktail",           imageUrl: "https://cdn.imweb.me/thumbnail/20250301/7abd0dbc60b22.jpg",  description: "민트와 야생화의 풍미가 어우러진 봄 같은 쥴렙.", isRecommended: true }),
  m(nextId(), "cat-200", "Virgin Berry Mojito",   "버진 베리 모히또",  12000, null, { origin: "Cocktail · Non-Alc", abv: 0, imageUrl: "https://cdn.imweb.me/thumbnail/20250302/d2c47b5d73cc1.jpg",  description: "논알콜. 베리와 라임의 상큼한 모히또. (알콜 추가 +3,000원)" }),
  m(nextId(), "cat-200", "Virgin Lime Mojito",    "버진 라임 모히또",  12000, null, { origin: "Cocktail · Non-Alc", abv: 0, imageUrl: "https://cdn.imweb.me/thumbnail/20250302/181750e136b2e.jpg",  description: "논알콜. 라임과 민트의 클래식한 모히또. (알콜 추가 +3,000원)" }),
  m(nextId(), "cat-200", "Faust",                 "파우스트",          16000, null, { origin: "Cocktail",           imageUrl: "https://cdn.imweb.me/thumbnail/20250302/6a0344bd1efcd.jpg",  description: "바텐더의 시그니처 한 잔." }),
  m(nextId(), "cat-200", "Gin & Tonic",           "진토닉",            13000, null, { origin: "Cocktail · Gin",     imageUrl: "https://cdn.imweb.me/thumbnail/20250918/7dc7080982c16.jpg",  description: "잘 짜여진 클래식 진토닉. 라임 한 조각." }),
  m(nextId(), "cat-200", "Gin Fizz",              "진피즈",            16000, null, { origin: "Cocktail · Gin",     imageUrl: "https://cdn.imweb.me/thumbnail/20250918/b3035039162e0.jpg",  description: "레몬·설탕·소다의 부드러운 거품, 그리고 진의 향." }),
  m(nextId(), "cat-200", "Gin Rickey",            "진리키",            16000, null, { origin: "Cocktail · Gin",     imageUrl: "https://cdn.imweb.me/thumbnail/20250918/252f3a4f6431d.jpg",  description: "라임과 진의 가장 깔끔한 만남." }),
  m(nextId(), "cat-200", "Daiquiri",              "다이키리",          16000, null, { origin: "Cocktail · Rum",     imageUrl: "https://cdn.imweb.me/thumbnail/20250918/625f168c95e2a.jpg",  description: "럼·라임·설탕의 정직한 삼각형." }),
  m(nextId(), "cat-200", "Cold Brew Martini",     "콜드브루 마티니",   16000, null, { origin: "Cocktail · Coffee",  imageUrl: "https://cdn.imweb.me/thumbnail/20250918/6885ba57c0ac7.jpg",  description: "콜드브루의 깊이와 보드카의 차가움이 어우러진 한 잔.", isRecommended: true }),
  m(nextId(), "cat-200", "불오름",                "불오름",            16000, null, { origin: "Cocktail", abv: 15,  imageUrl: "https://cdn.imweb.me/thumbnail/20260210/72a040093da62.jpg",  description: "Hazelnut, Lime etc.", isRecommended: true }),
  m(nextId(), "cat-200", "두유하이",              "두유하이",          16000, null, { origin: "Cocktail", abv: 10,  imageUrl: "https://cdn.imweb.me/thumbnail/20260210/87946912efaad.jpg", description: "Bourbon, butterscotch etc." }),
  m(nextId(), "cat-200", "라프로익 패션드",       "라프로익 패션드",   17000, null, { origin: "Cocktail",           imageUrl: "https://cdn.imweb.me/thumbnail/20260210/f926fab1042b7.jpg" }),
  m(nextId(), "cat-200", "라프로익 페니실린",     "라프로익 페니실린", 17000, null, { origin: "Cocktail",           imageUrl: "https://cdn.imweb.me/thumbnail/20260210/ca9f7c5990613.jpg" }),
  m(nextId(), "cat-200", "비터진",                "비터진",            13000, null, { origin: "Cocktail · Gin",     imageUrl: "https://cdn.imweb.me/thumbnail/20260210/71526f47e9660.jpg" }),
  m(nextId(), "cat-200", "커피앤시가렛",          "커피앤시가렛",      16000, null, { origin: "Cocktail",           imageUrl: "https://cdn.imweb.me/thumbnail/20260210/f25376f3afe91.jpg", description: "라프로익베이스의 피트 칵테일, 탐의 피트를 재해석한 시그니처 칵테일", isRecommended: true }),

  // ── FOOD (5종) ───────────────────────────────────────────────
  m(nextId(), "cat-210", "Melon & Jamón",       "멜론하몽",        18000, null, { origin: "Side Dish", imageUrl: "https://cdn.imweb.me/thumbnail/20240609/df0d5dbda4159.jpg", description: "달콤한 멜론과 짭조름한 하몽의 클래식한 페어링.", isRecommended: true }),
  m(nextId(), "cat-210", "Burrata Cheese Salad","부라타 치즈샐러드",16000, null, { origin: "Side Dish", imageUrl: "https://cdn.imweb.me/thumbnail/20240609/3bd221e58b0a8.jpg", description: "부라타 치즈와 그린 샐러드 — 위스키와 잘 어울리는 가벼운 한 접시." }),
  m(nextId(), "cat-210", "쉐리아포카토",        "쉐리아포카토",    14000, null, { origin: "Side Dish", imageUrl: "https://cdn.imweb.me/thumbnail/20240609/c963236134164.jpg", description: "아이스크림 + 쉐리 에스프레소" }),
  m(nextId(), "cat-210", "아이스크림 크로플",   "아이스크림 크로플",14000, null, { origin: "Side Dish", imageUrl: "https://cdn.imweb.me/thumbnail/20240609/d42ffba80db4a.jpg", description: "크로와상 + 와플" }),
  m(nextId(), "cat-210", "그린 올리브",         "그린 올리브",     10000, null, { origin: "Side Dish", imageUrl: "https://cdn.imweb.me/thumbnail/20240609/5a5b972e240dc.jpg" }),
];

// ── Mutable in-memory store ──────────────────────────────────────
let _categories: Category[] = [...SEED_CATEGORIES];
let _menus: Menu[] = [...SEED_MENUS];

export const db = {
  getCategories: () => [..._categories].sort((a, b) => a.priority - b.priority),
  getMenus: () => [..._menus].sort((a, b) => a.name.localeCompare(b.name)),

  insertMenu: (payload: Omit<Menu, "id" | "created_at" | "updated_at">) => {
    const menu: Menu = {
      ...payload,
      id: `menu-new-${Date.now()}`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    _menus.push(menu);
    return menu;
  },

  updateMenu: (id: string, patch: Partial<Menu>) => {
    const idx = _menus.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    _menus[idx] = { ..._menus[idx], ...patch, updated_at: new Date().toISOString() };
    return _menus[idx];
  },

  deleteMenu: (id: string) => {
    const idx = _menus.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    _menus.splice(idx, 1);
    return true;
  },
};
