-- =============================================================
-- TÀMH — Seed Data
-- bartamh.imweb.me 의 실제 메뉴를 기반으로 한 초기 데이터.
-- 실행 전 schema.sql 가 먼저 적용되어 있어야 합니다.
-- =============================================================

-- 카테고리 (priority가 낮을수록 상단)
insert into public.categories (id, name, subtitle, priority, icon)
values
  ('00000000-0000-0000-0000-000000000001', 'Signature', 'This Week''s Curated Picks', 0, 'Sparkles'),
  ('00000000-0000-0000-0000-000000000010', 'Highland', 'Single Malt · Scotland Highland', 10, 'Mountain'),
  ('00000000-0000-0000-0000-000000000020', 'Speyside', 'Single Malt · Speyside Region', 20, 'Trees'),
  ('00000000-0000-0000-0000-000000000030', 'Islay', 'Single Malt · The Isle of Peat', 30, 'Waves'),
  ('00000000-0000-0000-0000-000000000040', 'Island', 'Single Malt · Island Region', 40, 'Anchor'),
  ('00000000-0000-0000-0000-000000000050', 'Campbeltown', 'Single Malt · Campbeltown', 50, 'Compass'),
  ('00000000-0000-0000-0000-000000000060', 'Blended', 'Blended Whisky', 60, 'Layers'),
  ('00000000-0000-0000-0000-000000000070', 'Bourbon', 'American Whiskey & Bourbon', 70, 'Flame'),
  ('00000000-0000-0000-0000-000000000080', 'Japan', 'Japanese Whisky', 80, 'Cherry'),
  ('00000000-0000-0000-0000-000000000090', 'World', 'World Whisky · India · Taiwan · Australia', 90, 'Globe'),
  ('00000000-0000-0000-0000-000000000100', 'Brandy', 'Brandy & Cognac', 100, 'Wine')
on conflict (id) do nothing;

-- =============================================================
-- 메뉴 (대표 항목 — 전체 메뉴는 Admin에서 추가 가능)
-- =============================================================

-- SIGNATURE / 위클리 이벤트
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, cask_type, is_recommended, description) values
  ('00000000-0000-0000-0000-000000000001', 'Royal Salute 21y', '로얄살루트 21년 (Weekly Event)', 25000, 640000, 'Scotland · Blended', 40, 'Sherry / Bourbon', true, '21년의 시간이 잔에 부드럽게 내려앉는 한 잔. 셰리와 버번 캐스크가 우아하게 어우러져 긴 여운을 남깁니다.'),
  ('00000000-0000-0000-0000-000000000001', 'Ballantine''s 30y', '발렌타인 30년 (Weekly Event)', 39000, 1200000, 'Scotland · Blended', 43, 'Blended', true, '30년의 깊이가 만들어낸 부드러움. 진한 다크 프룻과 가죽 향이 천천히 피어오릅니다.'),
  ('00000000-0000-0000-0000-000000000001', 'Octomore .1.2', '옥토모어 .1.2 (Weekly Event)', 39000, 1200000, 'Islay', 59.1, 'Ex-Bourbon', true, '극한의 피트와 우아한 단맛이 공존하는 한 잔. 강렬함 뒤에 남는 의외의 섬세함이 매혹적입니다.'),
  ('00000000-0000-0000-0000-000000000001', 'Royal Brackla 21y', '로얄브라큘라 21년 (Weekly Event)', 45000, 800000, 'Highland', 40, 'Sherry', true, '21년 셰리 캐스크 숙성. 달콤한 건과일과 따뜻한 스파이스의 조화.'),
  ('00000000-0000-0000-0000-000000000001', 'Glenfiddich 23y', '글렌피딕 23년 (Weekly Event)', 60000, 1350000, 'Speyside', 43, 'Sherry Cask', true, '23년의 깊이가 만들어내는 다크 프룻과 우디 노트. 글렌피딕의 정수.');

-- HIGHLAND
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000010', 'Dalmore 12y', '달모어 12년', 18000, 300000, 'Highland', 40),
  ('00000000-0000-0000-0000-000000000010', 'Dalmore 15y', '달모어 15년', 32000, 640000, 'Highland', 40),
  ('00000000-0000-0000-0000-000000000010', 'Dalmore 18y', '달모어 18년', 48000, 740000, 'Highland', 43),
  ('00000000-0000-0000-0000-000000000010', 'Dalmore CigarMalt', '달모어 시가몰트', 32000, 640000, 'Highland', 44),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 12y', '글렌드로낙 12년', 19000, 290000, 'Highland', 43),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 15y', '글렌드로낙 15년', 30000, 560000, 'Highland', 46),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 18y', '글렌드로낙 18년', 50000, 900000, 'Highland', 46),
  ('00000000-0000-0000-0000-000000000010', 'Glenmorangie Original', '글렌모렌지 오리지날', 15000, 250000, 'Highland', 40),
  ('00000000-0000-0000-0000-000000000010', 'Glenmorangie Signet', '글렌모렌지 시그넷', 42000, 780000, 'Highland', 46),
  ('00000000-0000-0000-0000-000000000010', 'Oban 14y', '오반 14년', 19000, 340000, 'Highland', 43),
  ('00000000-0000-0000-0000-000000000010', 'Dalwhinnie 15y', '달위니 15년', 16000, 290000, 'Highland', 43);

-- SPEYSIDE
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, cask_type, is_recommended) values
  ('00000000-0000-0000-0000-000000000020', 'Macallan Double Cask 12y', '맥켈란 더블 캐스크 12년', 18000, 320000, 'Speyside', 40, 'Double Cask', false),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Sherry Cask 12y', '맥켈란 셰리 캐스크 12년', 19000, 340000, 'Speyside', 40, 'Sherry Cask', false),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Double Cask 18y', '맥켈란 더블 캐스크 18년', 53000, 1100000, 'Speyside', 43, 'Double Cask', true),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Sherry Cask 18y', '맥켈란 셰리 캐스크 18년', 60000, 1200000, 'Speyside', 43, 'Sherry Cask', true),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie DoubleWood 12y', '발베니 더블우드 12년', 18000, 320000, 'Speyside', 40, 'Bourbon / Sherry', false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Caribbean Cask 14y', '발베니 캐리비안 캐스크 14년', 25000, 490000, 'Speyside', 43, 'Rum Cask', false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie PX Cask 18y', '발베니 PX캐스크 18년', 50000, 950000, 'Speyside', 47.6, 'PX Cask', true),
  ('00000000-0000-0000-0000-000000000020', 'Glenfiddich 12y', '글렌피딕 12년', 16000, 290000, 'Speyside', 40, 'Bourbon / Sherry', false),
  ('00000000-0000-0000-0000-000000000020', 'Glenfiddich 18y', '글렌피딕 18년', 32000, 580000, 'Speyside', 40, 'Sherry / Bourbon', false),
  ('00000000-0000-0000-0000-000000000020', 'Glenlivet 15y', '글렌리벳 15년', 20000, 350000, 'Speyside', 40, 'French Oak', false),
  ('00000000-0000-0000-0000-000000000020', 'Aberlour A''bunadh', '아벨라워 아부나흐', 28000, 520000, 'Speyside', 60, 'Sherry CS', true),
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie 15y', '글렌알라키 15년', 29000, 550000, 'Speyside', 46, 'Sherry / PX', false);

-- ISLAY
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, cask_type, is_recommended) values
  ('00000000-0000-0000-0000-000000000030', 'Ardbeg 10y', '아드벡 10년', 18000, 290000, 'Islay', 46, 'Ex-Bourbon', true),
  ('00000000-0000-0000-0000-000000000030', 'Ardbeg Uigeadail', '아드벡 우거다일', 25000, 400000, 'Islay', 54.2, 'Sherry / Bourbon', false),
  ('00000000-0000-0000-0000-000000000030', 'Ardbeg Corryvreckan', '아드벡 코리브레칸', 29000, 550000, 'Islay', 57.1, 'French Oak', true),
  ('00000000-0000-0000-0000-000000000030', 'Bowmore 12y', '보모어 12년', 17000, 290000, 'Islay', 40, 'Bourbon / Sherry', false),
  ('00000000-0000-0000-0000-000000000030', 'Bowmore 18y A/M', '보모어 애스톤마틴 18년', 39000, 900000, 'Islay', 43, 'Sherry', true),
  ('00000000-0000-0000-0000-000000000030', 'Caol Ila 12y', '쿨일라 12년', 16000, 280000, 'Islay', 43, 'Ex-Bourbon', false),
  ('00000000-0000-0000-0000-000000000030', 'Lagavulin 16y', '라가불린 16년', 24000, 400000, 'Islay', 43, 'Ex-Bourbon', true),
  ('00000000-0000-0000-0000-000000000030', 'Laphroaig 10y', '라프로익 10년', 18000, 290000, 'Islay', 40, 'Ex-Bourbon', false),
  ('00000000-0000-0000-0000-000000000030', 'Laphroaig Lore', '라프로익 로어', 33000, 800000, 'Islay', 48, 'Multi-Cask', true),
  ('00000000-0000-0000-0000-000000000030', 'Octomore 14.1', '옥토모어 14.1', 55000, 1200000, 'Islay', 59.1, 'Ex-Bourbon', true),
  ('00000000-0000-0000-0000-000000000030', 'Talisker 10y', '탈리스커 10년', 16000, 260000, 'Islay', 45.8, 'Ex-Bourbon', false);

-- ISLAND
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000040', 'Arran 10y', '아란 10년', 16000, 270000, 'Island', 46),
  ('00000000-0000-0000-0000-000000000040', 'Arran Sauternes Cask', '아란 소테른 캐스크 피니쉬', 24000, 420000, 'Island', 50),
  ('00000000-0000-0000-0000-000000000040', 'Highland Park 12y', '하일랜드 파크 12년', 18000, 320000, 'Island', 40),
  ('00000000-0000-0000-0000-000000000040', 'Highland Park 15y', '하일랜드 파크 15년', 25000, 500000, 'Island', 44);

-- CAMPBELTOWN
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000050', 'Springbank 10y', '스프링뱅크 10년', 38000, 740000, 'Campbeltown', 46, true),
  ('00000000-0000-0000-0000-000000000050', 'Springbank 15y', '스프링뱅크 15년', 58000, 1200000, 'Campbeltown', 46, true),
  ('00000000-0000-0000-0000-000000000050', 'Kilkerran 12y', '킬커란 12년', 31000, 570000, 'Campbeltown', 46, false);

-- BLENDED
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000060', 'Ballantine''s 17y', '발렌타인 17년', 23000, 380000, 'Scotland', 40),
  ('00000000-0000-0000-0000-000000000060', 'Ballantine''s 21y', '발렌타인 21년', 31000, 560000, 'Scotland', 40),
  ('00000000-0000-0000-0000-000000000060', 'Johnnie Walker Blue Label', '조니워커 블루라벨', 36000, 640000, 'Scotland', 40),
  ('00000000-0000-0000-0000-000000000060', 'Royal Salute 21y', '로얄 살루트 21년', 36000, 640000, 'Scotland', 40),
  ('00000000-0000-0000-0000-000000000060', 'Royal Salute 32y', '로얄 살루트 32년', 100000, 1800000, 'Scotland', 40),
  ('00000000-0000-0000-0000-000000000060', 'Dewar''s 18y', '듀어스 18년', 21000, 340000, 'Scotland', 40);

-- BOURBON
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000070', 'Buffalo Trace', '버팔로 트레이스', 13000, 200000, 'Kentucky', 45),
  ('00000000-0000-0000-0000-000000000070', 'Maker''s Mark CS', '메이커스 마크 CS', 20000, 360000, 'Kentucky', 54),
  ('00000000-0000-0000-0000-000000000070', 'Woodford Reserve', '우드포드 리저브', 17000, 290000, 'Kentucky', 45.2),
  ('00000000-0000-0000-0000-000000000070', 'Booker''s 2022', '부커스 2022', 35000, 700000, 'Kentucky', 62),
  ('00000000-0000-0000-0000-000000000070', 'Wild Turkey Rare Breed', '와일드터키 레어브리드', 20000, 400000, 'Kentucky', 58.4),
  ('00000000-0000-0000-0000-000000000070', 'Knob Creek 9y', '놉크릭 9년', 15000, 250000, 'Kentucky', 50);

-- JAPAN
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000080', 'Hibiki Harmony', '히비키 하모니', 29000, 540000, 'Japan', 43, false),
  ('00000000-0000-0000-0000-000000000080', 'Hibiki 21', '히비키 21년', 120000, 1500000, 'Japan', 43, true),
  ('00000000-0000-0000-0000-000000000080', 'Yamazaki 12y', '산토리 야마자키 12년', 39000, 790000, 'Japan', 43, true),
  ('00000000-0000-0000-0000-000000000080', 'Hakushu DR', '하쿠슈 DR', 26000, 450000, 'Japan', 43, false),
  ('00000000-0000-0000-0000-000000000080', 'Yoichi', '요이치', 29000, 500000, 'Japan', 45, false);

-- WORLD
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000090', 'Amrut Fusion', '암룻 퓨젼', 20000, 320000, 'India', 50),
  ('00000000-0000-0000-0000-000000000090', 'Starward Nova', '스타워드 노바', 18000, 320000, 'Australia', 41),
  ('00000000-0000-0000-0000-000000000090', 'Kavalan Solist Vinho', '카발란 솔리스트 비노바리끄', 34000, 640000, 'Taiwan', 57.8),
  ('00000000-0000-0000-0000-000000000090', 'Kavalan Solist Oloroso', '카발란 솔리스트 올로로소 셰리', 58000, 1200000, 'Taiwan', 57.8);

-- BRANDY
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000100', 'Hennessy VSOP', '헤네시 VSOP', 18000, 290000, 'France', 40),
  ('00000000-0000-0000-0000-000000000100', 'Hennessy X.O', '헤네시 XO', 42000, 900000, 'France', 40),
  ('00000000-0000-0000-0000-000000000100', 'Camus X.O', '까뮤 XO', 25000, 450000, 'France', 40),
  ('00000000-0000-0000-0000-000000000100', 'Remy Martin X.O', '레미마틴 XO', 36000, 600000, 'France', 40);
