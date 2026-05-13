-- =============================================================
-- TÀMH — Luxury Bar Digital Menu & Order System
-- Supabase Schema (PostgreSQL)
-- =============================================================
-- 실행 순서:
--   1. Supabase Dashboard → SQL Editor에서 이 파일을 실행
--   2. seed.sql 실행하여 카테고리/메뉴 시드 데이터 삽입
--   3. Database → Replication → orders 테이블 Realtime 활성화
--   4. Storage → 'menu-images' 공개 버킷 생성
-- =============================================================

-- UUID 함수 보장
create extension if not exists "uuid-ossp";

-- =============================================================
-- ENUM
-- =============================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('PENDING', 'SERVED', 'PAID', 'CANCELED');
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
create index if not exists idx_menus_recommended on public.menus(is_recommended);

-- updated_at 자동 갱신 트리거
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
-- ORDERS
-- =============================================================
create table if not exists public.orders (
  id            uuid primary key default uuid_generate_v4(),
  table_number  integer not null,
  items         jsonb not null default '[]'::jsonb,
  total_price   integer not null default 0,
  status        order_status not null default 'PENDING',
  memo          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_orders_table on public.orders(table_number);

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================
alter table public.categories enable row level security;
alter table public.menus enable row level security;
alter table public.orders enable row level security;

-- 누구나 활성 메뉴/카테고리 읽기 가능 (Guest)
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "menus_public_read" on public.menus;
create policy "menus_public_read" on public.menus
  for select to anon, authenticated using (true);

-- Guest는 주문 삽입(INSERT)만 가능
drop policy if exists "orders_guest_insert" on public.orders;
create policy "orders_guest_insert" on public.orders
  for insert to anon, authenticated with check (true);

-- Guest가 자기 테이블의 주문을 조회/취소(선택사항)
drop policy if exists "orders_public_select" on public.orders;
create policy "orders_public_select" on public.orders
  for select to anon, authenticated using (true);

-- 관리자(Admin)는 모든 권한 — 서비스 롤로 접근
-- ※ service_role 키는 서버 라우트에서만 사용. 이 정책은 RLS 우회되지 않음.
drop policy if exists "menus_admin_write" on public.menus;
create policy "menus_admin_write" on public.menus
  for all to authenticated using (true) with check (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all to authenticated using (true) with check (true);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update to authenticated using (true) with check (true);

-- =============================================================
-- REALTIME
-- =============================================================
-- Supabase Dashboard → Database → Replication → supabase_realtime 게시물에서
-- orders 테이블을 enable 해주세요. (SQL로는 아래처럼 추가 가능)
alter publication supabase_realtime add table public.orders;
