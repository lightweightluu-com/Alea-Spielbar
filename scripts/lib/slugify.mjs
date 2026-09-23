// Shared by every script that turns a game's display name into a URL slug
// (scripts/fetch-bgg-data.mjs, scripts/fetch-wikipedia-data.mjs, scripts/migrate-games-to-supabase.mjs).
export function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
