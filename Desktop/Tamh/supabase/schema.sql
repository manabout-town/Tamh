-- =============================================================
-- TÀMH — Luxury Bar Digital Menu + POS Schema
-- Supabase (PostgreSQL)
-- =============================================================
-- 실행 순서:
--   1. Supabase Dashboard → SQL Editor → 이 파일 전체 실행
--   2. seed.sql 실행하여 메뉴 데이터 삽입
--   3. Database → Replication → 'tables', 'menus' 테이블 Realtime 활성화
-- =============================================================

create extension if not exists "uuid-ossp";

-- =============================================================
-- ENUM
-- =============================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'table_status') then
    create type table_status as enum ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLOSED');
  end if;
end $$;

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
-- MENUS  (이미지 필드는 유지하되 UI에서는 비노출)
-- =============================================================
create table if not exists public.menus (
  id              uuid primary key default uuid_generate_v4(),
  category_id     uuid not null references public.categories(id) on delete cascade,
  name            text not null,
  name_ko         text,
  description     text,
  price           integer not null,
  bottle_price    integer,
  image_url       text,
  origin          text,
  abv             numeric(4, 1),
  cask_type       text,
  is_active       boolean not null default true,
  is_recommended  boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_menus_category on public.menus(category_id);
create index if not exists idx_menus_active on public.menus(is_active);

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
-- TABLE GROUPS  (테이블 묶음 — 합석/연결 좌석)
-- =============================================================
create table if not exists public.table_groups (
  id          uuid primary key default uuid_generate_v4(),
  name        text,
  color       text default '#D4AF37',
  created_at  timestamptz not null default now()
);

-- =============================================================
-- TABLES  (POS 도면 — x, y, w, h, status, group_id)
-- =============================================================
create table if not exists public.tables (
  id            uuid primary key default uuid_generate_v4(),
  label         text not null,           -- 표시 라벨 (예: T1, T2, 바석 A)
  x             integer not null default 80,
  y             integer not null default 80,
  width         integer not null default 120,
  height        integer not null default 120,
  shape         text not null default 'rect' check (shape in ('rect', 'circle')),
  capacity      integer not null default 4,
  status        table_status not null default 'AVAILABLE',
  group_id      uuid references public.table_groups(id) on delete set null,
  note          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_tables_group on public.tables(group_id);
create index if not exists idx_tables_status on public.tables(status);

drop trigger if exists trg_tables_updated_at on public.tables;
create trigger trg_tables_updated_at
  before update on public.tables
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- ORDERS  (선택 — 추후 매장 → 주문 연결용)
-- =============================================================
create table if not exists public.orders (
  id            uuid primary key default uuid_generate_v4(),
  table_id      uuid references public.tables(id) on delete set null,
  items         jsonb not null default '[]'::jsonb,
  total_price   integer not null default 0,
  status        text not null default 'OPEN',  -- OPEN, CLOSED, CANCELED
  memo          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_orders_table on public.orders(table_id);
create index if not exists idx_orders_status on public.orders(status);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- 매장 내부용 도구 — 익명도 읽기/수정 가능하도록 단순화
-- 운영 단계에서는 Supabase Auth로 격상 권장
-- =============================================================
alter table public.categories  enable row level security;
alter table public.menus       enable row level security;
alter table public.table_groups enable row level security;
alter table public.tables      enable row level security;
alter table public.orders      enable row level security;

-- 모든 접근 허용 정책 (매장 내부망 가정)
do $$
declare t text;
begin
  for t in select unnest(array['categories','menus','table_groups','tables','orders']) loop
    execute format('drop policy if exists "%s_all" on public.%I', t, t);
    execute format(
      'create policy "%s_all" on public.%I for all to anon, authenticated using (true) with check (true)',
      t, t
    );
  end loop;
end $$;

-- =============================================================
-- REALTIME
-- =============================================================
alter publication supabase_realtime add table public.tables;
alter publication supabase_realtime add table public.menus;
alter publication supabase_realtime add table public.orders;
