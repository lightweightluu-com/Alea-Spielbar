import menuData from './menu-data.json'

export interface MenuItem {
  section: string
  category: string
  slug: string
  name: string
  description?: string | null
  price: string
  unit?: string | null
  featured?: boolean
  sortOrder: number
}

export const menuItems: MenuItem[] = menuData as MenuItem[]

export interface MenuCategory {
  category: string
  items: MenuItem[]
}

export interface MenuSection {
  section: string
  categories: MenuCategory[]
}

/** Groups the flat item list into section -> category -> items, preserving `sortOrder`. */
export function menuBySection(): MenuSection[] {
  const sections = new Map<string, Map<string, MenuItem[]>>()

  for (const item of [...menuItems].sort((a, b) => a.sortOrder - b.sortOrder)) {
    if (!sections.has(item.section)) sections.set(item.section, new Map())
    const categories = sections.get(item.section)!
    if (!categories.has(item.category)) categories.set(item.category, [])
    categories.get(item.category)!.push(item)
  }

  return [...sections.entries()].map(([section, categories]) => ({
    section,
    categories: [...categories.entries()].map(([category, items]) => ({ category, items })),
  }))
}
