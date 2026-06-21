-- Editable site content (hero images, novedades videos), keyed by section.
-- Permissive anon access, consistent with the vehicles table and the app's
-- current lack of real admin auth. Tighten when auth is added.

create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Idempotent: CREATE POLICY has no IF NOT EXISTS, so DROP-then-CREATE.
drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read"
  on public.site_content for select using (true);

drop policy if exists "site_content anon all" on public.site_content;
create policy "site_content anon all"
  on public.site_content for all using (true) with check (true);

-- Seed the two rows so reads/upserts always have a target.
insert into public.site_content (key, data) values
  ('hero', '{"images": []}'::jsonb),
  ('novedades', '{"videos": []}'::jsonb)
on conflict (key) do nothing;
