-- Alea-Spielbar Supabase schema.
--
-- This is a reference copy for reproducibility/disaster-recovery — the repo has no Supabase CLI
-- or migrations pipeline (deliberately, to match the project's minimal tooling philosophy). Run
-- this once, by hand, in the Supabase SQL editor of a fresh project.
--
-- Column names on `games` map 1:1 onto the `Game` interface in src/games.ts:3-20 (camelCase ->
-- snake_case) so scripts/sync-games-from-supabase.mjs and scripts/migrate-games-to-supabase.mjs
-- are near-identity transforms.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------------------------
-- games
-- ---------------------------------------------------------------------------------------------

create table games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  language text,
  expansions text[],
  slug text unique not null,
  bgg_id text,
  bgg_name text,
  image text,
  description text,
  min_players int,
  max_players int,
  min_playtime int,
  max_playtime int,
  complexity numeric,
  rating numeric,
  bgg_url text,
  wikipedia_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table games enable row level security;

-- No public policies at all: the public site only ever reads games at build time via
-- scripts/sync-games-from-supabase.mjs, which authenticates with the service-role key and so
-- bypasses RLS entirely. Only the signed-in owner (the only account in this project) gets access.
create policy games_admin_all on games
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- If a live "what's on the shelf right now" widget is ever wanted on the public site, add:
--   create policy games_public_read on games for select using (true);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger games_set_updated_at
  before update on games
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- menu_items
-- ---------------------------------------------------------------------------------------------
-- The Speise- & Getränkekarte, editable from /admin instead of being a static PDF. Same
-- build-time pattern as `games`: scripts/sync-menu-from-supabase.mjs -> src/menu-data.json,
-- consumed by src/menu.ts. `section` is the top-level tab ("Getränke", "Cocktails",
-- "Spirituosen", "Essen"), `category` the subheading within it ("Bier – Offen", "Wein", ...).
-- `price` and `unit` are free text (not numeric) because the real menu mixes single prices,
-- glass/bottle pairs ("9.5 | 62") and surcharges ("+0.5") — trying to model that as columns
-- would only fight the actual data.

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  category text not null,
  slug text unique not null,
  name text not null,
  description text,
  price text not null,
  unit text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table menu_items enable row level security;

-- Same access shape as `games`: no public policies — the public site only ever reads menu items
-- at build time via scripts/sync-menu-from-supabase.mjs, which uses the service-role key and so
-- bypasses RLS entirely. Only the signed-in owner gets runtime access, via /admin.
create policy menu_items_admin_all on menu_items
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create trigger menu_items_set_updated_at
  before update on menu_items
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- reservations
-- ---------------------------------------------------------------------------------------------

create table reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  anliegen_id text not null,
  anliegen_label text not null,
  date date,
  time time,
  people int,
  message text not null,
  status text not null default 'new' check (status in ('new', 'confirmed', 'declined')),
  created_at timestamptz not null default now()
);

alter table reservations enable row level security;

-- Anyone (anon key) can create a reservation — matches today's "anyone can submit the form"
-- behavior. No public SELECT/UPDATE/DELETE: only the owner can read/manage the list.
create policy reservations_public_insert on reservations
  for insert
  with check (true);

create policy reservations_admin_all on reservations
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ---------------------------------------------------------------------------------------------
-- storage: game cover images
-- ---------------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('game-covers', 'game-covers', true)
on conflict (id) do nothing;

-- Public read so the built static site's <img src> can load covers without auth.
create policy game_covers_public_read on storage.objects
  for select
  using (bucket_id = 'game-covers');

-- Only the signed-in owner may upload/replace/delete covers.
create policy game_covers_admin_write on storage.objects
  for insert
  with check (bucket_id = 'game-covers' and auth.uid() is not null);

create policy game_covers_admin_update on storage.objects
  for update
  using (bucket_id = 'game-covers' and auth.uid() is not null);

create policy game_covers_admin_delete on storage.objects
  for delete
  using (bucket_id = 'game-covers' and auth.uid() is not null);
