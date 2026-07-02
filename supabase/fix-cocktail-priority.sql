-- =============================================================
-- TÀMH — Reorder fix
-- Cocktail / Food 카테고리를 메뉴 필터의 맨 우측으로 보냅니다.
-- (priority 정렬 결과: ... → Brandy → Cocktail → Food)
-- =============================================================
update public.categories
   set priority = 150
 where id = '00000000-0000-0000-0000-000000000200';   -- Cocktail

update public.categories
   set priority = 200
 where id = '00000000-0000-0000-0000-000000000210';   -- Food (이미 200이지만 확인용)
