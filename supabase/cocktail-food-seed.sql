-- =============================================================
-- TÀMH — Cocktail + Food Seed (보충)
-- bartamh.imweb.me/16(칵테일), /17(음식) 데이터.
-- 기존 schema.sql 적용 후 이 파일만 추가 실행하면 됩니다.
-- 중복 카테고리 ID는 on conflict do nothing 처리.
-- =============================================================

-- =============================================================
-- 신규 카테고리
-- =============================================================
insert into public.categories (id, name, subtitle, priority, icon) values
  ('00000000-0000-0000-0000-000000000200', 'Cocktail',  'Bartender''s Cocktails', 150, 'GlassWater'),
  ('00000000-0000-0000-0000-000000000210', 'Food',      'Side Dish · Pairing',    200, 'UtensilsCrossed')
on conflict (id) do nothing;

-- =============================================================
-- COCKTAIL (11종)
-- =============================================================
insert into public.menus
  (category_id, name, name_ko, price, bottle_price, origin, abv, description, is_recommended)
values
  -- 시그니처 라인 (재료/도수 표기됨)
  ('00000000-0000-0000-0000-000000000200', 'Godfather',           '갓파더',
    16000, null, 'Cocktail', 33,
    'Bourbon · Disaronno 등. 33% — 묵직한 단맛과 아몬드의 깊이.',
    true),

  ('00000000-0000-0000-0000-000000000200', 'Cherry Old Fashioned', '체리 올드패션드',
    16000, null, 'Cocktail', 26,
    'Bourbon · Angostura 등. 26% — 체리 향이 더해진 고전적 한 잔.',
    true),

  ('00000000-0000-0000-0000-000000000200', 'Wild Flower Julep',    '와일드 플라워 쥴렙',
    16000, null, 'Cocktail', null,
    '민트와 야생화의 풍미가 어우러진 봄 같은 쥴렙.',
    true),

  -- 베리에이션 모히또 (논알콜 기본, 알콜은 +3,000원 옵션)
  ('00000000-0000-0000-0000-000000000200', 'Virgin Berry Mojito',  '버진 베리 모히또',
    12000, null, 'Cocktail · Non-Alc', 0,
    '논알콜. 베리와 라임의 상큼한 모히또. (알콜 추가 +3,000원)',
    false),

  ('00000000-0000-0000-0000-000000000200', 'Virgin Lime Mojito',   '버진 라임 모히또',
    12000, null, 'Cocktail · Non-Alc', 0,
    '논알콜. 라임과 민트의 클래식한 모히또. (알콜 추가 +3,000원)',
    false),

  ('00000000-0000-0000-0000-000000000200', 'Faust',                '파우스트',
    16000, null, 'Cocktail', null,
    '바텐더의 시그니처 한 잔.',
    false),

  -- 진 베이스 클래식
  ('00000000-0000-0000-0000-000000000200', 'Gin & Tonic',          '진토닉',
    13000, null, 'Cocktail · Gin', null,
    '잘 짜여진 클래식 진토닉. 라임 한 조각.',
    false),

  ('00000000-0000-0000-0000-000000000200', 'Gin Fizz',             '진피즈',
    16000, null, 'Cocktail · Gin', null,
    '레몬·설탕·소다의 부드러운 거품, 그리고 진의 향.',
    false),

  ('00000000-0000-0000-0000-000000000200', 'Gin Rickey',           '진리키',
    16000, null, 'Cocktail · Gin', null,
    '라임과 진의 가장 깔끔한 만남.',
    false),

  ('00000000-0000-0000-0000-000000000200', 'Daiquiri',             '다이키리',
    16000, null, 'Cocktail · Rum', null,
    '럼·라임·설탕의 정직한 삼각형.',
    false),

  ('00000000-0000-0000-0000-000000000200', 'Cold Brew Martini',    '콜드브루 마티니',
    16000, null, 'Cocktail · Coffee', null,
    '콜드브루의 깊이와 보드카의 차가움이 어우러진 한 잔.',
    true);

-- =============================================================
-- FOOD (2종)
-- =============================================================
insert into public.menus
  (category_id, name, name_ko, price, bottle_price, origin, abv, description, is_recommended)
values
  ('00000000-0000-0000-0000-000000000210', 'Melon & Jamón',        '멜론하몽',
    18000, null, 'Side Dish', null,
    '달콤한 멜론과 짭조름한 하몽의 클래식한 페어링.',
    true),

  ('00000000-0000-0000-0000-000000000210', 'Burrata Cheese Salad', '부라타 치즈샐러드',
    16000, null, 'Side Dish', null,
    '부라타 치즈와 그린 샐러드 — 위스키와 잘 어울리는 가벼운 한 접시.',
    false);
