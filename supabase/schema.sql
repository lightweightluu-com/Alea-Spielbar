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
