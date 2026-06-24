-- Accessories catalog (e.g. chargers, audio, etc), shown on the public
-- /accesorios page. Same permissive RLS as vehicles/site_content —
-- consistent with the app's current lack of real admin auth.

create table if not exists public.accessories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_num numeric(12,2) not null default 0,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accessories enable row level security;

drop policy if exists "accessories public read" on public.accessories;
create policy "accessories public read"
  on public.accessories for select using (published = true);

drop policy if exists "accessories anon all" on public.accessories;
create policy "accessories anon all"
  on public.accessories for all using (true) with check (true);
