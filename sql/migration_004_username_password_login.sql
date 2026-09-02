-- ============================================================================
-- Migration 004 — replace Supabase Auth login with a self-managed
-- username/password table (bcrypt-hashed via pgcrypto).
--
-- WHY: signInWithPassword() (Supabase Auth) was unreliable for this project.
-- This migration drops the dependency on auth.users entirely for admin login.
-- Accounts are created only via the seed insert below (no signup flow).
--
-- SECURITY NOTE: because login no longer produces a Supabase Auth JWT, the
-- existing "Admin write X" policies (`using (auth.role() = 'authenticated')`)
-- can never pass again — the frontend only ever holds the public anon key.
-- This migration replaces every "Admin write" policy with `using (true)`,
-- i.e. write access is gated ONLY by the app's own login screen, not by
-- Postgres RLS. Acceptable for a small personal portfolio; do not reuse this
-- pattern for anything handling sensitive/multi-tenant data.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. Credentials table (separate from the unused `admin_users` content table)
-- ============================================================================
create table admin_credentials (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create trigger update_admin_credentials_updated_at before update on admin_credentials
  for each row execute function update_updated_at_column();

alter table admin_credentials enable row level security;
-- No policy is created for direct select/update/delete/insert on this table:
-- with RLS enabled and zero policies, PostgREST (anon/authenticated key) has
-- ZERO access to it. The only way in is the SECURITY DEFINER function below.

-- ============================================================================
-- 2. Login RPC — verifies username/password server-side via pgcrypto,
--    never returns the hash to the client.
-- ============================================================================
create or replace function verify_admin_login(p_username text, p_password text)
returns table (id uuid, username text)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select ac.id, ac.username
  from admin_credentials ac
  where ac.username = p_username
    and ac.is_active = true
    and ac.password_hash = extensions.crypt(p_password, ac.password_hash);
end;
$$;

-- Only the anon/authenticated PostgREST roles need to call this RPC.
revoke all on function verify_admin_login(text, text) from public;
grant execute on function verify_admin_login(text, text) to anon, authenticated;

-- ============================================================================
-- 3. Seed the two accounts (bcrypt hash generated at insert time)
-- ============================================================================
insert into admin_credentials (username, password_hash) values
  ('mfaiq.9c@gmail.com', extensions.crypt('12345678', extensions.gen_salt('bf'))),
  ('m.faiq.h.u@gmail.com', extensions.crypt('87654321', extensions.gen_salt('bf')))
on conflict (username) do nothing;

-- ============================================================================
-- 4. Re-point every "Admin write" policy from auth.role()='authenticated'
--    to an open check, since there's no Supabase Auth session anymore.
-- ============================================================================
drop policy if exists "Admin write profile" on profile;
create policy "Admin write profile" on profile for all using (true) with check (true);

drop policy if exists "Admin write socials" on socials;
create policy "Admin write socials" on socials for all using (true) with check (true);

drop policy if exists "Admin write education" on education;
create policy "Admin write education" on education for all using (true) with check (true);

drop policy if exists "Admin write experience" on experience;
create policy "Admin write experience" on experience for all using (true) with check (true);

drop policy if exists "Admin write languages" on languages;
create policy "Admin write languages" on languages for all using (true) with check (true);

drop policy if exists "Admin write page_content" on page_content;
create policy "Admin write page_content" on page_content for all using (true) with check (true);

drop policy if exists "Admin write projects" on projects;
create policy "Admin write projects" on projects for all using (true) with check (true);

drop policy if exists "Admin write project_technologies" on project_technologies;
create policy "Admin write project_technologies" on project_technologies for all using (true) with check (true);

drop policy if exists "Admin write skills" on skills;
create policy "Admin write skills" on skills for all using (true) with check (true);

drop policy if exists "Admin write certifications" on certifications;
create policy "Admin write certifications" on certifications for all using (true) with check (true);

drop policy if exists "Admin write academic_projects" on academic_projects;
create policy "Admin write academic_projects" on academic_projects for all using (true) with check (true);

drop policy if exists "Admin write leadership" on leadership;
create policy "Admin write leadership" on leadership for all using (true) with check (true);

drop policy if exists "Admin write creative_works" on creative_works;
create policy "Admin write creative_works" on creative_works for all using (true) with check (true);

drop policy if exists "Admin write carousel_photos" on carousel_photos;
create policy "Admin write carousel_photos" on carousel_photos for all using (true) with check (true);

-- admin_users (the old, never-wired-up table) no longer matters for auth;
-- leave its existing policies as-is (harmless, still locked to 'authenticated').
