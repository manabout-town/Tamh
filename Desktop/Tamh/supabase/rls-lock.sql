-- =============================================================
-- TÀMH — RLS Lock Migration
-- 기존 Supabase 프로젝트에 적용하는 잠금 마이그레이션.
-- SQL Editor 에서 실행.
-- =============================================================

-- event_price 컬럼 추가 (없는 경우)
alter table public.menus
  add column if not exists event_price integer;

-- 기존 정책 전부 제거
do $$
declare t text;
begin
  for t in select unnest(array['categories','menus']) loop
    execute format('drop policy if exists "%s_all"       on public.%I', t, t);
    execute format('drop policy if exists "%s_anon_read" on public.%I', t, t);
    execute format('drop policy if exists "%s_auth_all"  on public.%I', t, t);
  end loop;
end $$;

-- RLS 활성화 (이미 활성화돼 있어도 무해)
alter table public.categories enable row level security;
alter table public.menus      enable row level security;

-- anon: SELECT 전용
create policy "categories_anon_read" on public.categories
  for select to anon using (true);

create policy "menus_anon_read" on public.menus
  for select to anon using (true);

-- authenticated (service_role 포함): 전체 CRUD
create policy "categories_auth_all" on public.categories
  for all to authenticated using (true) with check (true);

create policy "menus_auth_all" on public.menus
  for all to authenticated using (true) with check (true);

-- =============================================================
-- 적용 확인 쿼리
-- select schemaname, tablename, policyname, roles, cmd
-- from pg_policies
-- where schemaname = 'public';
-- =============================================================
