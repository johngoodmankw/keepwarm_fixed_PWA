// KeepWarm Dietary Preferences Library
// Source: KeepWarm Epaper Manifests - Dietary Preferences.csv
// "Free-from" items — things the dish does NOT contain

const DIETARY_CDN_BASE = "https://cdn.jsdelivr.net/gh/johngoodmankw/keep-warm/dietary_preferences_noun/hardened_2.5"

export interface DietaryPreference {
  id: string
  name: string
  abbr: string
  iconUrl: string
  svgFilename: string
}

function dietary(id: string, name: string, abbr: string, svgFilename: string): DietaryPreference {
  return { id, name, abbr, svgFilename, iconUrl: `${DIETARY_CDN_BASE}/${svgFilename}` }
}

export const dietaryLibrary: DietaryPreference[] = [
  dietary("gluten-free",   "Gluten-Free",   "GLUTF", "gluten_free.svg"),
  dietary("dairy-free",    "Dairy-Free",    "DAIRF", "dairy_free.svg"),
  dietary("nut-free",      "Nut-Free",      "NUTF",  "nut_free.svg"),
  dietary("sugar-free",    "Sugar-Free",    "SUGF",  "sugar_free.svg"),
  dietary("alcohol-free",  "Alcohol-Free",  "ALCF",  "alcohol_free.svg"),
  dietary("vegan",         "Vegan",         "VEGN",  "vegan.svg"),
  dietary("vegetarian",    "Vegetarian",    "VEGT",  "vegetarian.svg"),
  dietary("halal",         "Halal",         "HAL",   "halal.svg"),
  dietary("kosher",        "Kosher",        "KOSH",  "kosher.svg"),
]

export function searchDietary(query: string): DietaryPreference[] {
  if (!query.trim()) {
    return dietaryLibrary
  }
  const lowerQuery = query.toLowerCase()
  return dietaryLibrary.filter(pref =>
    pref.name.toLowerCase().includes(lowerQuery) ||
    pref.abbr.toLowerCase().includes(lowerQuery) ||
    pref.id.toLowerCase().includes(lowerQuery)
  )
}

export function getDietaryById(id: string): DietaryPreference | undefined {
  return dietaryLibrary.find(pref => pref.id === id)
}

export function getDietaryByIds(ids: string[]): DietaryPreference[] {
  return ids.map(id => getDietaryById(id)).filter(Boolean) as DietaryPreference[]
}
