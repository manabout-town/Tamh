-- =============================================================
-- TÀMH — Menu Schema (Supabase / PostgreSQL)
-- 메뉴판 전용. 매장(POS) 기능은 제거되었습니다.
-- =============================================================
-- 실행 순서:
--   1. SQL Editor → 이 파일 실행
--   2. seed.sql 실행하여 메뉴 데이터 삽입
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
-- RLS — 단순화 (익명도 읽기/수정 가능)
-- =============================================================
alter table public.categories enable row level security;
alter table public.menus      enable row level security;

do $$
declare t text;
begin
  for t in select unnest(array['categories','menus']) loop
    execute format('drop policy if exists "%s_all" on public.%I', t, t);
    execute format(
      'create policy "%s_all" on public.%I for all to anon, authenticated using (true) with check (true)',
      t, t
    );
  end loop;
end $$;

-- =============================================================
-- (선택) 기존 매장 테이블이 있다면 정리
-- 데이터가 있을 수 있으니 자동 drop은 하지 않습니다.
-- 필요 시 아래 주석을 풀어 수동 실행:
--   drop table if exists public.orders cascade;
--   drop table if exists public.tables cascade;
--   drop table if exists public.table_groups cascade;
-- =============================================================
