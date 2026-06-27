-- =============================================================
-- TÀMH — Complete Data SQL (Schema + Seed + Locked RLS)
-- 이 파일 하나로 새 Supabase 프로젝트에 전체 메뉴를 재현합니다.
-- 실행: SQL Editor 에서 이 파일 전체 실행
-- =============================================================

create extension if not exists "uuid-ossp";

-- =============================================================
-- CATEGORIES
-- =============================================================
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  subtitle    text,
  priority    integer not null default 100,
  icon        text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_categories_priority on public.categories(priority);

-- =============================================================
-- MENUS
-- =============================================================
create table if not exists public.menus (
  id              uuid primary key default uuid_generate_v4(),
  category_id     uuid not null references public.categories(id) on delete cascade,
  name            text not null,
  name_ko         text,
  description     text,
  price           integer not null,
  bottle_price    integer,
  event_price     integer,
  image_url       text,
  origin          text,
  abv             numeric(4, 1),
  cask_type       text,
  is_active       boolean not null default true,
  is_recommended  boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_menus_category  on public.menus(category_id);
create index if not exists idx_menus_active    on public.menus(is_active);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_menus_updated_at on public.menus;
create trigger trg_menus_updated_at
  before update on public.menus
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- RLS — LOCKED
-- anon  : SELECT 전용 (읽기만)
-- authenticated (service_role) : 전체 CRUD
-- =============================================================
alter table public.categories enable row level security;
alter table public.menus      enable row level security;

do $$
declare t text;
begin
  for t in select unnest(array['categories','menus']) loop
    -- 기존 정책 전부 삭제
    execute format('drop policy if exists "%s_all"       on public.%I', t, t);
    execute format('drop policy if exists "%s_anon_read" on public.%I', t, t);
    execute format('drop policy if exists "%s_auth_all"  on public.%I', t, t);
    -- anon: SELECT 전용
    execute format(
      'create policy "%s_anon_read" on public.%I for select to anon using (true)',
      t, t
    );
    -- authenticated (service_role): 전체
    execute format(
      'create policy "%s_auth_all" on public.%I for all to authenticated using (true) with check (true)',
      t, t
    );
  end loop;
end $$;

-- =============================================================
-- CATEGORIES
-- =============================================================
insert into public.categories (id, name, subtitle, priority, icon) values
  ('00000000-0000-0000-0000-000000000001', 'Signature',    'Weekly Event · This Week''s Curated Picks', 0,   'Sparkles'),
  ('00000000-0000-0000-0000-000000000002', 'Random Whisky','바텐더의 블라인드 한 잔 (정답 시 1+1)',     5,   'Dices'),
  ('00000000-0000-0000-0000-000000000010', 'Highland',     'Single Malt · Scotland Highland',           10,  'Mountain'),
  ('00000000-0000-0000-0000-000000000020', 'Speyside',     'Single Malt · Speyside Region',             20,  'Trees'),
  ('00000000-0000-0000-0000-000000000030', 'Campbeltown',  'Single Malt · Campbeltown',                 30,  'Compass'),
  ('00000000-0000-0000-0000-000000000040', 'Islay',        'Single Malt · The Isle of Peat',            40,  'Waves'),
  ('00000000-0000-0000-0000-000000000050', 'Island',       'Single Malt · Island Region',               50,  'Anchor'),
  ('00000000-0000-0000-0000-000000000060', 'Blended',      'Blended Whisky',                            60,  'Layers'),
  ('00000000-0000-0000-0000-000000000070', 'Bourbon',      'American Whiskey & Bourbon',                70,  'Flame'),
  ('00000000-0000-0000-0000-000000000080', 'Japan',        'Japanese Whisky',                           80,  'Cherry'),
  ('00000000-0000-0000-0000-000000000090', 'Australia',    'Australian Whisky',                         90,  'Sun'),
  ('00000000-0000-0000-0000-000000000091', 'India',        'Indian Whisky',                             95,  'Flower'),
  ('00000000-0000-0000-0000-000000000092', 'Taiwan',       'Taiwanese Whisky · Kavalan',                100, 'Leaf'),
  ('00000000-0000-0000-0000-000000000100', 'Brandy',       'Brandy & Cognac',                           110, 'Wine'),
  ('00000000-0000-0000-0000-000000000200', 'Cocktail',     'Bartender''s Cocktails',                    150, 'GlassWater'),
  ('00000000-0000-0000-0000-000000000210', 'Food',         'Side Dish · Pairing',                       200, 'UtensilsCrossed')
on conflict (id) do nothing;

-- =============================================================
-- SIGNATURE / WEEKLY EVENT
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, cask_type, is_recommended, description) values
  ('00000000-0000-0000-0000-000000000001', 'Royal Salute 21y (Weekly)',  '로얄살루트 21년 (30ml) — Weekly Event', 25000, 640000,  'Scotland · Blended', 40,   'Sherry / Bourbon', true, '21년의 시간이 잔에 부드럽게 내려앉는 한 잔. 36,000 → 25,000으로 만나보세요.'),
  ('00000000-0000-0000-0000-000000000001', 'Ballantine''s 30y (Weekly)', '발렌타인 30년 (30ml) — Weekly Event',   39000, 1200000, 'Scotland · Blended', 43,   'Blended',          true, '30년의 깊이가 만들어낸 부드러움. 65,000 → 39,000.'),
  ('00000000-0000-0000-0000-000000000001', 'Octomore .1.2 (Weekly)',     '옥토모어 .1.2 (30ml) — Weekly Event',   39000, 1200000, 'Islay',              59.1, 'Ex-Bourbon',       true, '극한의 피트와 우아한 단맛이 공존하는 한 잔. 55,000 → 39,000.'),
  ('00000000-0000-0000-0000-000000000001', 'Royal Brackla 21y (Weekly)', '로얄브라큘라 21 (30ml) — Weekly Event', 45000, 800000,  'Highland',           46,   'Sherry',           true, '21년 셰리 캐스크 숙성의 따뜻한 한 잔. 65,000 → 45,000.'),
  ('00000000-0000-0000-0000-000000000001', 'Glenfiddich 23y (Weekly)',   '글렌피딕 23년 (30ml) — Weekly Event',   60000, 1350000, 'Speyside',           43,   'Sherry Cask',      true, '23년의 깊이가 만들어내는 다크 프룻과 우디 노트. 78,000 → 60,000.');

-- =============================================================
-- RANDOM WHISKY
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, cask_type, is_recommended, description) values
  ('00000000-0000-0000-0000-000000000002', 'Random Whisky', '랜덤 위스키 (1+1 이벤트)', 10000, null, 'Mystery', 'Bartender''s Pick', true,
   '바텐더가 이름을 알려주지 않고 드리는 한 잔. 1,2,3,4,5만원대 위스키 중 택 1. 정답을 맞추면 1+1.');

-- =============================================================
-- HIGHLAND (37종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin) values
  ('00000000-0000-0000-0000-000000000010', 'Dalmore 12y',           '달모어 12년',           18000, 300000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Dalmore 15y',           '달모어 15년',           32000, 640000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Dalmore 18y',           '달모어 18년',           48000, 740000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Dalmore CigarMalt',     '달모어 시가몰트',       32000, 640000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 8y Hielan', '글렌드로낙 8년 히란',   20000, 340000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 12y',       '글렌드로낙 12년',       19000, 290000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 15y',       '글렌드로낙 15년',       30000, 560000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 16y',       '글렌드로낙 16년',       45000, 800000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 21y',       '글렌드로낙 21년',       60000, 1200000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach Peated',    '글렌드로낙 피티드',     20000, 320000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach PortWood',  '글렌드로낙 포트우드',   26000, 450000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach CS',        '글렌드로낙 CS',         33000, 590000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glendronach 2008',      '글렌드로낙 2008',       60000, 1200000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenmorangie Original',     '글렌모렌지 오리지날',     15000, 250000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenmorangie Lasanta',      '글렌모렌지 라산타',       18000, 290000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenmorangie Nectar D''Or', '글렌모렌지 더 넥타',      25000, 380000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenmorangie Quinta Ruban', '글렌모렌지 퀸타루반',     21000, 340000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenmorangie Signet',       '글렌모렌지 시그넷',       42000, 780000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glengoyne 12y',         '글렌고인 12년',         18000, 300000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glengoyne 15y',         '글렌고인 15년',         24000, 420000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glengoyne 18y',         '글렌고인 18년',         36000, 640000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas 8y',          '글렌파클라스 8년',          16000, 300000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas 10y',         '글렌파클라스 10년',         18000, 320000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas 12y',         '글렌파클라스 12년',         19000, 340000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas 15y',         '글렌파클라스 15년',         23000, 380000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas 25y',         '글렌파클라스 25년',         60000, 900000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas 12y CS',      '글렌파클라스 12년 CS',      30000, 540000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas 105 CS',      '글렌파클라스 105 CS',       23000, 400000,  'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Glenfarclas Family 2000', '글렌파클라스 패밀리 2000',  60000, 1200000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Oban 14y',         '오반 14년',         19000, 340000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Old Pulteney 12y', '올드 풀티니 12년',  15000, 250000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Tomatin 12y',      '토마틴 12년',       16000, 250000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Tomatin 15y',      '토마틴 15년',       19000, 330000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'AnCnoc 12y',       '아녹 12년',         15000, 250000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Balblair 12y',     '발블레어 12년',     17000, 320000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Dalwhinnie 15y',   '달위니 15년',       16000, 290000, 'Highland'),
  ('00000000-0000-0000-0000-000000000010', 'Deanston 12y',     '딘스톤 12년',       14000, 250000, 'Highland');

-- =============================================================
-- SPEYSIDE (50종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, cask_type) values
  ('00000000-0000-0000-0000-000000000020', 'Aberlour Double Cask 12y', '아벨라워 더블캐스크 12년', 17000, 290000, 'Speyside', 'Double Cask'),
  ('00000000-0000-0000-0000-000000000020', 'Aberlour Double Cask 14y', '아벨라워 더블캐스크 14년', 26000, 480000, 'Speyside', 'Double Cask'),
  ('00000000-0000-0000-0000-000000000020', 'Aberlour A''bunadh',       '아벨라워 아부나흐',        28000, 520000, 'Speyside', 'Sherry CS');

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, cask_type, is_recommended) values
  ('00000000-0000-0000-0000-000000000020', 'Balvenie DoubleWood 12y',           '발베니 더블우드 12년',         18000, 320000,  'Speyside', 'Bourbon / Sherry',     false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Single Barrel 12y',        '발베니 싱글배럴 12년',         23000, 380000,  'Speyside', 'Single Barrel',        false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Week of Peat 14y',         '발베니 위크오브피트 14년',     29000, 540000,  'Speyside', 'Peated',               false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Caribbean Cask 14y',       '발베니 캐리비안 캐스크 14년',  25000, 490000,  'Speyside', 'Rum Cask',             false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Madeira Cask 15y',         '발베니 마데이라 캐스크 15년',  29000, 540000,  'Speyside', 'Madeira',              false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Single Barrel 15y Sherry', '발베니 15 싱글배럴 셰리',      60000, 1200000, 'Speyside', 'Sherry Single Barrel',  true),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie French Oak 16y',           '발베니 16 프렌치오크',         45000, 800000,  'Speyside', 'French Oak',           false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie PX Cask 18y',              '발베니 PX캐스크 18년',          50000, 950000,  'Speyside', 'PX Cask',              true),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie 19 Week of Peat',          '발베니 19년 위크오브피트',      50000, 950000,  'Speyside', 'Peated',               false),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Portwood Cask 21y',        '발베니 포트우드 캐스크 21년',   68000, 1200000, 'Speyside', 'Port Wood',            true),
  ('00000000-0000-0000-0000-000000000020', 'Balvenie Madeira Cask 21y',         '발베니 마데이라 캐스크 21년',   68000, 1200000, 'Speyside', 'Madeira',              true);

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin) values
  ('00000000-0000-0000-0000-000000000020', 'Glenfiddich 12y', '글렌피딕 12년', 16000, 290000,  'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glenfiddich 15y', '글렌피딕 15년', 20000, 400000,  'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glenfiddich 18y', '글렌피딕 18년', 32000, 580000,  'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glenfiddich 21y', '글렌피딕 21년', 52000, 930000,  'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glenfiddich 23y', '글렌피딕 23년', 78000, 1350000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glen Grant 10y', '글렌그란트 10년', 12000, 180000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glen Grant 12y', '글렌그란트 12년', 16000, 290000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glen Grant 15y', '글렌그란트 15년', 19000, 340000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Glen Grant 18y', '글렌그란트 18년', 30000, 550000, 'Speyside');

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, cask_type) values
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie 10y CS',       '글렌알라키 10년 CS',     29000, 550000, 'Speyside', 'Cask Strength'),
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie 12y',          '글렌알라키 12년',         23000, 390000, 'Speyside', 'Sherry / PX'),
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie 13y',          '글렌알라키 13년',         25000, 480000, 'Speyside', 'Sherry'),
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie 15y',          '글렌알라키 15년',         29000, 550000, 'Speyside', 'Sherry / PX'),
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie 18y',          '글렌알라키 18년',         47000, 850000, 'Speyside', 'Sherry'),
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie Cuvée Cask',   '글렌알라키 쿠베 캐스크',  24000, 400000, 'Speyside', 'Cuvée'),
  ('00000000-0000-0000-0000-000000000020', 'GlenAllachie Sinteis 2015', '글렌알라키 신테이스 2015', 35000, 650000, 'Speyside', 'Single Cask'),
  ('00000000-0000-0000-0000-000000000020', 'Glenrothes 12y', '글렌로티스 12년', 15000, 270000, 'Speyside', null),
  ('00000000-0000-0000-0000-000000000020', 'Glenrothes WMC', '글렌로티스 WMC', 24000, 400000, 'Speyside', null),
  ('00000000-0000-0000-0000-000000000020', 'Glenrothes 18y', '글렌로티스 18년', 32000, 550000, 'Speyside', null);

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, cask_type) values
  ('00000000-0000-0000-0000-000000000020', 'Glenlivet 12y',            '글렌리벳 12년',            16000, 280000, 'Speyside', 'Bourbon'),
  ('00000000-0000-0000-0000-000000000020', 'Glenlivet 13y CS',         '글렌리벳 13년 CS',          47000, 850000, 'Speyside', 'Cask Strength'),
  ('00000000-0000-0000-0000-000000000020', 'Glenlivet 15y',            '글렌리벳 15년',             20000, 350000, 'Speyside', 'French Oak'),
  ('00000000-0000-0000-0000-000000000020', 'Glenlivet 16y Nadurra CS', '글렌리벳 나두라 16년 CS',  48000, 850000, 'Speyside', 'Sherry CS'),
  ('00000000-0000-0000-0000-000000000020', 'Glenlivet 18y',            '글렌리벳 18년',             32000, 580000, 'Speyside', 'Sherry / Bourbon');

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, cask_type, is_recommended) values
  ('00000000-0000-0000-0000-000000000020', 'Macallan Double Cask 12y',  '맥켈란 더블캐스크 12년',   18000, 320000,  'Speyside', 'Double Cask',  false),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Triple Cask 12y',  '맥켈란 트리플캐스크 12년', 19000, 340000,  'Speyside', 'Triple Cask',  false),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Sherry Cask 12y',  '맥켈란 셰리캐스크 12년',   19000, 340000,  'Speyside', 'Sherry Cask',  false),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Double Cask 15y',  '맥켈란 더블캐스크 15년',   30000, 550000,  'Speyside', 'Double Cask',  false),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Triple Cask 15y',  '맥켈란 트리플캐스크 15년', 30000, 550000,  'Speyside', 'Triple Cask',  false),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Double Cask 18y',  '맥켈란 더블캐스크 18년',   53000, 1100000, 'Speyside', 'Double Cask',  true),
  ('00000000-0000-0000-0000-000000000020', 'Macallan Sherry Cask 18y',  '맥켈란 셰리캐스크 18년',   60000, 1200000, 'Speyside', 'Sherry Cask',  true);

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin) values
  ('00000000-0000-0000-0000-000000000020', 'Monkey Shoulder',            '몽키 숄더',           12000, 180000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Speyburn 10y',               '스페이번 10년',        12000, 180000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'BenRiach 12y',               '벤리악 12년',         16000, 270000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Benromach 10y',              '벤로막 10년',         16000, 290000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'Cragganmore 12y',            '크라겐모어 12년',      15000, 270000, 'Speyside'),
  ('00000000-0000-0000-0000-000000000020', 'The Singleton Dufftown 12y', '싱글톤 더프타운 12년', 14000, 250000, 'Speyside');

-- =============================================================
-- CAMPBELTOWN (3종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000030', 'Springbank 10y', '스프링뱅크 10년', 38000, 740000,  'Campbeltown', 46, true),
  ('00000000-0000-0000-0000-000000000030', 'Springbank 15y', '스프링뱅크 15년', 58000, 1200000, 'Campbeltown', 46, true),
  ('00000000-0000-0000-0000-000000000030', 'Kilkerran 12y',  '킬커란 12년',     31000, 570000,  'Campbeltown', 46, false);

-- =============================================================
-- ISLAY (33종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg Wee Beastie',   '아드벡 위비스티',       14000, 240000, 'Islay', 47.4, false),
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg Smoketrails',   '아드벡 스모크트레일스', 18000, 300000, 'Islay', 46,   false),
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg 10y',           '아드벡 10년',           18000, 290000, 'Islay', 46,   true),
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg Anthology 13y', '아드벡 앤솔로지 13년',   36000, 720000, 'Islay', 46,   false),
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg Smokiverse',    '아드벡 스모키버스',     30000, 600000, 'Islay', 46.5, false),
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg An Oa',         '아드벡 안 오',           19000, 320000, 'Islay', 46.6, false),
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg Uigeadail',     '아드벡 우거다일',       25000, 400000, 'Islay', 54.2, true),
  ('00000000-0000-0000-0000-000000000040', 'Ardbeg Corryvreckan',  '아드벡 코리브레칸',     29000, 550000, 'Islay', 57.1, true),
  ('00000000-0000-0000-0000-000000000040', 'Bowmore 12y',          '보모어 12년',            17000, 290000, 'Islay', 40,   false),
  ('00000000-0000-0000-0000-000000000040', 'Bowmore 15y',          '보모어 15년',            22000, 400000, 'Islay', 43,   false),
  ('00000000-0000-0000-0000-000000000040', 'Bowmore 18y A/M',      '보모어 애스톤마틴 18년', 39000, 900000, 'Islay', 43,   true);

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000040', 'Caol Ila 12y',              '쿨일라 12년',      16000, 280000,  'Islay', 43),
  ('00000000-0000-0000-0000-000000000040', 'Caol Ila DE',               '쿨일라 DE',        19000, 320000,  'Islay', 43),
  ('00000000-0000-0000-0000-000000000040', 'Caol Ila 25y',              '쿨일라 25년',      80000, 1400000, 'Islay', 43),
  ('00000000-0000-0000-0000-000000000040', 'Kilchoman Sanaig',          '킬호만 사닉',       20000, 360000,  'Islay', 46),
  ('00000000-0000-0000-0000-000000000040', 'Kilchoman Machir Bay',      '킬호만 마키어 베이', 21000, 360000,  'Islay', 46),
  ('00000000-0000-0000-0000-000000000040', 'Kilchoman Loch Gorm',       '킬호만 로크 곰',    33000, 360000,  'Islay', 46),
  ('00000000-0000-0000-0000-000000000040', 'Talisker 8y SR',            '탈리스커 SR 8년',  19000, 320000,  'Islay', 57.9),
  ('00000000-0000-0000-0000-000000000040', 'Talisker 10y',              '탈리스커 10년',    16000, 260000,  'Islay', 45.8),
  ('00000000-0000-0000-0000-000000000040', 'Talisker Port Ruighe',      '탈리스커 포트뤼',  20000, 370000,  'Islay', 45.8),
  ('00000000-0000-0000-0000-000000000040', 'Talisker 18y',              '탈리스커 18년',    45000, 900000,  'Islay', 45.8),
  ('00000000-0000-0000-0000-000000000040', 'Bunnahabhain 12y',          '부나하벤 12년',    18000, 300000,  'Islay', 46.3),
  ('00000000-0000-0000-0000-000000000040', 'Bunnahabhain 12y CS',       '부나하벤 12년 CS', 40000, 700000,  'Islay', 55.1),
  ('00000000-0000-0000-0000-000000000040', 'Bruichladdich Port Charlotte','브룩라디 포트샬롯', 20000, 360000, 'Islay', 50);

insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000040', 'Lagavulin 8y',  '라가불린 8년',  17000, 290000, 'Islay', 48, false),
  ('00000000-0000-0000-0000-000000000040', 'Lagavulin 16y', '라가불린 16년', 24000, 400000, 'Islay', 43, true),
  ('00000000-0000-0000-0000-000000000040', 'Laphroaig Oak Select',   '라프로익 오크셀렉트', 16000, 270000, 'Islay', 40, false),
  ('00000000-0000-0000-0000-000000000040', 'Laphroaig 10y',          '라프로익 10년',       18000, 290000, 'Islay', 40, false),
  ('00000000-0000-0000-0000-000000000040', 'Laphroaig Quarter Cask', '라프로익 쿼터캐스크', 18000, 290000, 'Islay', 48, false),
  ('00000000-0000-0000-0000-000000000040', 'Laphroaig PX',           '라프로익 PX',         18000, 400000, 'Islay', 48, false),
  ('00000000-0000-0000-0000-000000000040', 'Laphroaig Lore',         '라프로익 로어',       33000, 800000, 'Islay', 48, true),
  ('00000000-0000-0000-0000-000000000040', 'Octomore 14.1',          '옥토모어 14.1',       55000, 1200000, 'Islay', 59.1, true),
  ('00000000-0000-0000-0000-000000000040', 'Octomore 14.2',          '옥토모어 14.2',       55000, 1200000, 'Islay', 57.3, true);

-- =============================================================
-- ISLAND (11종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000050', 'Arran 10y',                   '아란 10년',                16000, 270000, 'Island', 46),
  ('00000000-0000-0000-0000-000000000050', 'Arran Barrel Reserve Malt',   '아란 베럴 리저브 몰트',    16000, 270000, 'Island', 43),
  ('00000000-0000-0000-0000-000000000050', 'Arran Quarter Cask',          '아란 쿼터 캐스크',         20000, 360000, 'Island', 56.2),
  ('00000000-0000-0000-0000-000000000050', 'Arran Sauternes Cask Finish', '아란 소테른 캐스크 피니쉬', 24000, 420000, 'Island', 50),
  ('00000000-0000-0000-0000-000000000050', 'Arran Port Cask Finish',      '아란 포트 캐스크 피니쉬',  23000, 400000, 'Island', 50),
  ('00000000-0000-0000-0000-000000000050', 'Arran Amarone Cask Finish',   '아란 아마로네 캐스크 피니쉬', 23000, 400000, 'Island', 50),
  ('00000000-0000-0000-0000-000000000050', 'Arran Sherry Cask',           '아란 셰리 캐스크',         26000, 540000, 'Island', 55.8),
  ('00000000-0000-0000-0000-000000000050', 'Arran Machrie Moor CS',       '아란 마크리무어 CS',       25000, 500000, 'Island', 56.2),
  ('00000000-0000-0000-0000-000000000050', 'Highland Park 12y',           '하일랜드 파크 12년',       18000, 320000, 'Island', 40),
  ('00000000-0000-0000-0000-000000000050', 'Highland Park 15y',           '하일랜드 파크 15년',       25000, 500000, 'Island', 40),
  ('00000000-0000-0000-0000-000000000050', 'Highland Park 16y',           '하일랜드 파크 16년',       25000, 500000, 'Island', 40);

-- =============================================================
-- BLENDED (15종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000060', 'Ballantine''s 12y',          '발렌타인 12년',   13000, 180000,  'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Ballantine''s 17y',          '발렌타인 17년',   23000, 380000,  'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Ballantine''s 21y',          '발렌타인 21년',   31000, 560000,  'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Ballantine''s 30y',          '발렌타인 30년',   55000, 1200000, 'Scotland', 43, true),
  ('00000000-0000-0000-0000-000000000060', 'Dewar''s 12y',               '듀어스 12년',     14000, 190000,  'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Dewar''s 15y',               '듀어스 15년',     16000, 210000,  'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Dewar''s 18y',               '듀어스 18년',     21000, 340000,  'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Johnnie Walker Black Label',     '조니워커 블랙라벨',     12000, 180000, 'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Johnnie Walker Black Label Old', '조니워커 블랙라벨 올드', 30000, 560000, 'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Johnnie Walker Green Label',     '조니워커 그린라벨',     16000, 260000, 'Scotland', 43, false),
  ('00000000-0000-0000-0000-000000000060', 'Johnnie Walker Gold Label',      '조니워커 골드라벨',     16000, 260000, 'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Johnnie Walker Blue Label',      '조니워커 블루라벨',     36000, 640000, 'Scotland', 40, true),
  ('00000000-0000-0000-0000-000000000060', 'Royal Salute 21y', '로얄 살루트 21년', 36000,  640000,  'Scotland', 40, false),
  ('00000000-0000-0000-0000-000000000060', 'Royal Salute 25y', '로얄 살루트 25년', 70000,  1200000, 'Scotland', 40, true),
  ('00000000-0000-0000-0000-000000000060', 'Royal Salute 32y', '로얄 살루트 32년', 100000, 1800000, 'Scotland', 40, true);

-- =============================================================
-- BOURBON (25종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000070', 'Shenk''s 2022',                    '쉥크스 2022',              50000, 1200000, 'Kentucky',  45.6,  true),
  ('00000000-0000-0000-0000-000000000070', 'Buffalo Trace',                    '버팔로 트레이스',           13000, 200000,  'Kentucky',  45,    false),
  ('00000000-0000-0000-0000-000000000070', 'Jack Daniel Single Barrel',        '잭다니엘 싱글배럴',         18000, 300000,  'Tennessee', 47,    false),
  ('00000000-0000-0000-0000-000000000070', 'Knob Creek 9y',                    '놉크릭 9년',               15000, 250000,  'Kentucky',  50,    false),
  ('00000000-0000-0000-0000-000000000070', '1792 Small Batch',                 '1792 스몰배치',             15000, 250000,  'Kentucky',  46.85, false),
  ('00000000-0000-0000-0000-000000000070', 'Russell''s Reserve 10y',           '러셀 리저브 10년',          15000, 280000,  'Kentucky',  45,    false),
  ('00000000-0000-0000-0000-000000000070', 'Russell''s Reserve Single Barrel', '러셀 리저브 싱글배럴',      17000, 290000,  'Kentucky',  55,    false),
  ('00000000-0000-0000-0000-000000000070', 'Russell''s Reserve Rye',           '러셀 리저브 라이',          18000, 290000,  'Kentucky',  52.5,  false),
  ('00000000-0000-0000-0000-000000000070', 'Four Roses Small Batch',           '포 로지스 스몰배치',        16000, 260000,  'Kentucky',  45,    false),
  ('00000000-0000-0000-0000-000000000070', '1776 James E. Pepper Bourbon',     '1776 제임스 E 페퍼 버번',   19000, 330000,  'Kentucky',  46,    false),
  ('00000000-0000-0000-0000-000000000070', 'Rowan''s Creek',                   '로완스 크릭',               19000, 330000,  'Kentucky',  50.05, false),
  ('00000000-0000-0000-0000-000000000070', 'Woodford Reserve',                 '우드포드 리저브',           17000, 290000,  'Kentucky',  45.2,  false),
  ('00000000-0000-0000-0000-000000000070', 'Woodford Reserve Rye',             '우드포드 리저브 라이',      17000, 290000,  'Kentucky',  45.2,  false),
  ('00000000-0000-0000-0000-000000000070', 'Noah''s Mill',                     '노아스 밀',                 25000, 480000,  'Kentucky',  57.15, false),
  ('00000000-0000-0000-0000-000000000070', 'Booker''s 2022',                   '부커스 2022',               35000, 700000,  'Kentucky',  62.6,  true),
  ('00000000-0000-0000-0000-000000000070', 'Town Branch Bourbon',              '타운 브렌치 버번',          18000, 290000,  'Kentucky',  40,    false),
  ('00000000-0000-0000-0000-000000000070', 'Town Branch Rye',                  '타운 브렌치 라이',          18000, 290000,  'Kentucky',  50,    false),
  ('00000000-0000-0000-0000-000000000070', 'VHW Port Cask',                    'VHW 포트캐스크',            19000, 320000,  'Virginia',  46,    false),
  ('00000000-0000-0000-0000-000000000070', 'Wild Turkey 8y',                   '와일드터키 8년',            15000, 250000,  'Kentucky',  50.5,  false),
  ('00000000-0000-0000-0000-000000000070', 'Wild Turkey Rare Breed',           '와일드터키 레어브리드',     20000, 400000,  'Kentucky',  58.4,  true),
  ('00000000-0000-0000-0000-000000000070', 'Maker''s Mark',                    '메이커스 마크',             13000, 220000,  'Kentucky',  45,    false),
  ('00000000-0000-0000-0000-000000000070', 'Maker''s Mark CS',                 '메이커스 마크 CS',          20000, 360000,  'Kentucky',  54,    true),
  ('00000000-0000-0000-0000-000000000070', 'Michter''s Sour Mash',             '믹터스 사워 매시',          19000, 320000,  'Kentucky',  43,    false),
  ('00000000-0000-0000-0000-000000000070', 'Michter''s Small Batch',           '믹터스 스몰 배치',          17000, 280000,  'Kentucky',  45.7,  false),
  ('00000000-0000-0000-0000-000000000070', 'Michter''s Unblended',             '믹터스 언블렌디드',         17000, 280000,  'Kentucky',  41.7,  false);

-- =============================================================
-- JAPAN (11종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000080', 'Suntory Yamazaki DR',          '산토리 야마자키 DR',          26000,  450000,  'Japan', 43, false),
  ('00000000-0000-0000-0000-000000000080', 'Suntory Yamazaki 12y',         '산토리 야마자키 12년',         39000,  790000,  'Japan', 43, true),
  ('00000000-0000-0000-0000-000000000080', 'Suntory Yamazaki Smoky Batch', '산토리 야마자키 스모키 배치', 39000,  790000,  'Japan', 48, false),
  ('00000000-0000-0000-0000-000000000080', 'Hakushu DR',                   '하쿠슈 DR',                   26000,  450000,  'Japan', 43, false),
  ('00000000-0000-0000-0000-000000000080', 'Hakushu Bittersweet',          '하쿠슈 비터스윗',             39000,  790000,  'Japan', 48, false),
  ('00000000-0000-0000-0000-000000000080', 'Hibiki Harmony',               '히비키 하모니',                29000,  540000,  'Japan', 43, false),
  ('00000000-0000-0000-0000-000000000080', 'Hibiki 21',                    '히비키 21년',                  120000, 1500000, 'Japan', 43, true),
  ('00000000-0000-0000-0000-000000000080', 'Hibiki Master Select',         '히비키 마스터 셀렉트',         31000,  540000,  'Japan', 43, false),
  ('00000000-0000-0000-0000-000000000080', 'Hibiki Blender''s Choice',     '히비키 블렌더스 초이스',      31000,  540000,  'Japan', 43, false),
  ('00000000-0000-0000-0000-000000000080', 'Yoichi',                       '요이치',                       29000,  500000,  'Japan', 45, false),
  ('00000000-0000-0000-0000-000000000080', 'Yoichi Miyagikyo',             '요이치 미야기쿄',              35000,  600000,  'Japan', 45, false);

-- =============================================================
-- AUSTRALIA (3종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000090', 'Starward Nova',   '스타워드 노바',   18000, 320000, 'Australia', 41),
  ('00000000-0000-0000-0000-000000000090', 'Starward Fortis', '스타워드 포티스', 21000, 400000, 'Australia', 50),
  ('00000000-0000-0000-0000-000000000090', 'Starward Solera', '스타워드 솔레라', 22000, 400000, 'Australia', 43);

-- =============================================================
-- INDIA (3종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv) values
  ('00000000-0000-0000-0000-000000000091', 'Amrut Indian', '암룻 인디안', 16000, 250000, 'India', 46),
  ('00000000-0000-0000-0000-000000000091', 'Amrut Peated', '암룻 피티드', 18000, 290000, 'India', 46),
  ('00000000-0000-0000-0000-000000000091', 'Amrut Fusion', '암룻 퓨젼',   20000, 320000, 'India', 50);

-- =============================================================
-- TAIWAN — Kavalan Solist (10종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, cask_type, is_recommended) values
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Vinho Barrique', '카발란 솔리스트 비노바리끄', 34000, 640000,  'Taiwan', 57.8, 'Vinho Barrique', false),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Ex-Bourbon',     '카발란 솔리스트 엑스 버번',  34000, 640000,  'Taiwan', 57.8, 'Ex-Bourbon',     false),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Port',           '카발란 솔리스트 포트',       34000, 640000,  'Taiwan', 57.8, 'Port Cask',      false),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Brandy',         '카발란 솔리스트 브랜디',     38000, 720000,  'Taiwan', 57.8, 'Brandy Cask',    false),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Peated',         '카발란 솔리스트 피티드',     45000, 720000,  'Taiwan', 57.8, 'Peated',         false),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Oloroso Sherry', '카발란 솔리스트 올로로소',   58000, 1200000, 'Taiwan', 57.8, 'Oloroso Sherry', true),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Madeira',        '카발란 솔리스트 마데이라',   49000, 1200000, 'Taiwan', 57.8, 'Madeira',        false),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist PX',             '카발란 솔리스트 PX',         60000, 1200000, 'Taiwan', 57.8, 'PX Sherry',      true),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Moscatel',       '카발란 솔리스트 모스카텔',   65000, 1300000, 'Taiwan', 57.8, 'Moscatel',       true),
  ('00000000-0000-0000-0000-000000000092', 'Kavalan Solist Fino',           '카발란 솔리스트 피노',       70000, 1500000, 'Taiwan', 57.8, 'Fino Sherry',    true);

-- =============================================================
-- BRANDY (5종)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, bottle_price, origin, abv, is_recommended) values
  ('00000000-0000-0000-0000-000000000100', 'Hennessy VSOP',   '헤네시 VSOP',  18000, 290000, 'France · Cognac', 40, false),
  ('00000000-0000-0000-0000-000000000100', 'Hennessy X.O',    '헤네시 XO',    42000, 900000, 'France · Cognac', 40, true),
  ('00000000-0000-0000-0000-000000000100', 'Camus VSOP',      '까뮤 VSOP',    17000, 280000, 'France · Cognac', 40, false),
  ('00000000-0000-0000-0000-000000000100', 'Camus X.O',       '까뮤 XO',      25000, 450000, 'France · Cognac', 40, false),
  ('00000000-0000-0000-0000-000000000100', 'Remy Martin X.O', '레미마틴 XO',  36000, 600000, 'France · Cognac', 40, true);

-- =============================================================
-- COCKTAIL (17종 — 기존 11 + 신규 6)
-- image_url: cocktail-data.ts 기준 (name_ko 키로 매핑)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, image_url, origin, abv, description, is_recommended) values
  -- 기존 시그니처
  ('00000000-0000-0000-0000-000000000200', 'Godfather',           '갓파더',
    16000, 'https://cdn.imweb.me/thumbnail/20240609/f8fa6c5070965.jpg',
    'Cocktail', 33, 'Bourbon · Disaronno 등. 33% — 묵직한 단맛과 아몬드의 깊이.', true),

  ('00000000-0000-0000-0000-000000000200', 'Cherry Old Fashioned', '체리 올드패션드',
    16000, 'https://cdn.imweb.me/thumbnail/20240609/b999cc178d4f4.jpg',
    'Cocktail', 26, 'Bourbon · Angostura 등. 26% — 체리 향이 더해진 고전적 한 잔.', true),

  ('00000000-0000-0000-0000-000000000200', 'Wild Flower Julep', '와일드 플라워 쥴렙',
    16000, 'https://cdn.imweb.me/thumbnail/20250301/7abd0dbc60b22.jpg',
    'Cocktail', null, '민트와 야생화의 풍미가 어우러진 봄 같은 쥴렙.', true),

  -- 논알콜
  ('00000000-0000-0000-0000-000000000200', 'Virgin Berry Mojito', '버진 베리 모히또',
    12000, 'https://cdn.imweb.me/thumbnail/20250302/d2c47b5d73cc1.jpg',
    'Cocktail · Non-Alc', 0, '논알콜. 베리와 라임의 상큼한 모히또. (알콜 추가 +3,000원)', false),

  ('00000000-0000-0000-0000-000000000200', 'Virgin Lime Mojito', '버진 라임 모히또',
    12000, 'https://cdn.imweb.me/thumbnail/20250302/181750e136b2e.jpg',
    'Cocktail · Non-Alc', 0, '논알콜. 라임과 민트의 클래식한 모히또. (알콜 추가 +3,000원)', false),

  ('00000000-0000-0000-0000-000000000200', 'Faust', '파우스트',
    16000, 'https://cdn.imweb.me/thumbnail/20250302/6a0344bd1efcd.jpg',
    'Cocktail', null, '바텐더의 시그니처 한 잔.', false),

  -- 진 베이스
  ('00000000-0000-0000-0000-000000000200', 'Gin & Tonic', '진토닉',
    13000, 'https://cdn.imweb.me/thumbnail/20250918/7dc7080982c16.jpg',
    'Cocktail · Gin', null, '잘 짜여진 클래식 진토닉. 라임 한 조각.', false),

  ('00000000-0000-0000-0000-000000000200', 'Gin Fizz', '진피즈',
    16000, 'https://cdn.imweb.me/thumbnail/20250918/b3035039162e0.jpg',
    'Cocktail · Gin', null, '레몬·설탕·소다의 부드러운 거품, 그리고 진의 향.', false),

  ('00000000-0000-0000-0000-000000000200', 'Gin Rickey', '진리키',
    16000, 'https://cdn.imweb.me/thumbnail/20250918/252f3a4f6431d.jpg',
    'Cocktail · Gin', null, '라임과 진의 가장 깔끔한 만남.', false),

  ('00000000-0000-0000-0000-000000000200', 'Daiquiri', '다이키리',
    16000, 'https://cdn.imweb.me/thumbnail/20250918/625f168c95e2a.jpg',
    'Cocktail · Rum', null, '럼·라임·설탕의 정직한 삼각형.', false),

  ('00000000-0000-0000-0000-000000000200', 'Cold Brew Martini', '콜드브루 마티니',
    16000, 'https://cdn.imweb.me/thumbnail/20250918/6885ba57c0ac7.jpg',
    'Cocktail · Coffee', null, '콜드브루의 깊이와 보드카의 차가움이 어우러진 한 잔.', true),

  -- 신규 시그니처 칵테일 (cocktail-data.ts 기준)
  ('00000000-0000-0000-0000-000000000200', '불오름', '불오름',
    16000, 'https://cdn.imweb.me/thumbnail/20260210/72a040093da62.jpg',
    'Cocktail', 15, 'Hazelnut, Lime etc.', true),

  ('00000000-0000-0000-0000-000000000200', '두유하이', '두유하이',
    16000, 'https://cdn.imweb.me/thumbnail/20260210/87946912efaad.jpg',
    'Cocktail', 10, 'Bourbon, butterscotch etc.', false),

  ('00000000-0000-0000-0000-000000000200', '라프로익 패션드', '라프로익 패션드',
    17000, 'https://cdn.imweb.me/thumbnail/20260210/f926fab1042b7.jpg',
    'Cocktail', null, null, false),

  ('00000000-0000-0000-0000-000000000200', '라프로익 페니실린', '라프로익 페니실린',
    17000, 'https://cdn.imweb.me/thumbnail/20260210/ca9f7c5990613.jpg',
    'Cocktail', null, null, false),

  ('00000000-0000-0000-0000-000000000200', '비터진', '비터진',
    13000, 'https://cdn.imweb.me/thumbnail/20260210/71526f47e9660.jpg',
    'Cocktail · Gin', null, null, false),

  ('00000000-0000-0000-0000-000000000200', '커피앤시가렛', '커피앤시가렛',
    16000, 'https://cdn.imweb.me/thumbnail/20260210/f25376f3afe91.jpg',
    'Cocktail', null, '라프로익베이스의 피트 칵테일, 탐의 피트를 재해석한 시그니처 칵테일', true);

-- =============================================================
-- FOOD (5종 — food-data.ts 기준, image_url 포함)
-- =============================================================
insert into public.menus (category_id, name, name_ko, price, image_url, origin, description, is_recommended) values
  ('00000000-0000-0000-0000-000000000210', 'Melon & Jamón', '멜론하몽',
    18000, 'https://cdn.imweb.me/thumbnail/20240609/df0d5dbda4159.jpg',
    'Side Dish', '달콤한 멜론과 짭조름한 하몽의 클래식한 페어링.', true),

  ('00000000-0000-0000-0000-000000000210', 'Burrata Cheese Salad', '부라타 치즈샐러드',
    16000, 'https://cdn.imweb.me/thumbnail/20240609/3bd221e58b0a8.jpg',
    'Side Dish', '부라타 치즈와 그린 샐러드 — 위스키와 잘 어울리는 가벼운 한 접시.', false),

  ('00000000-0000-0000-0000-000000000210', '쉐리아포카토', '쉐리아포카토',
    14000, 'https://cdn.imweb.me/thumbnail/20240609/c963236134164.jpg',
    'Side Dish', '아이스크림 + 쉐리 에스프레소', false),

  ('00000000-0000-0000-0000-000000000210', '아이스크림 크로플', '아이스크림 크로플',
    14000, 'https://cdn.imweb.me/thumbnail/20240609/d42ffba80db4a.jpg',
    'Side Dish', '크로와상 + 와플', false),

  ('00000000-0000-0000-0000-000000000210', '그린 올리브', '그린 올리브',
    10000, 'https://cdn.imweb.me/thumbnail/20240609/5a5b972e240dc.jpg',
    'Side Dish', null, false);

-- =============================================================
-- 완료. 총 약 240종 / 카테고리 16
-- anon: SELECT 전용 / 관리자 쓰기: service_role (API Route)
-- =============================================================
