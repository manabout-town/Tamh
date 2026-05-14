-- =============================================================
-- TÀMH — Default Table Layout Seed
-- 매장의 초기 테이블 8개를 도면 위에 배치합니다.
-- 좌표는 캔버스(가로 1200 × 세로 700) 기준입니다.
-- =============================================================
insert into public.tables (label, x, y, width, height, shape, capacity, status) values
  ('T1', 120,  120, 140, 140, 'rect',   4, 'AVAILABLE'),
  ('T2', 300,  120, 140, 140, 'rect',   4, 'AVAILABLE'),
  ('T3', 480,  120, 140, 140, 'rect',   4, 'AVAILABLE'),
  ('T4', 660,  120, 160, 160, 'circle', 6, 'AVAILABLE'),
  ('T5', 870,  120, 160, 160, 'circle', 6, 'AVAILABLE'),
  ('바석 A', 120, 360, 380, 110, 'rect', 8, 'AVAILABLE'),
  ('바석 B', 520, 360, 380, 110, 'rect', 8, 'AVAILABLE'),
  ('VIP룸',  920, 360, 200, 200, 'rect', 6, 'RESERVED');
