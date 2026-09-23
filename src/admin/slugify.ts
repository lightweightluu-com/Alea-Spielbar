// Browser-side copy of scripts/lib/slugify.mjs — kept in sync by hand. Small enough (and on
// opposite sides of the scripts/ vs src/ boundary) that a shared package would be overkill.
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
