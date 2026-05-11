// KeepWarm Allergens Library
// Source: KeepWarm Epaper Manifests - Allergens.csv

const ALLERGEN_CDN_BASE = "https://cdn.jsdelivr.net/gh/johngoodmankw/keep-warm/allergen_icons_noun/hardened_2.5"

export interface Allergen {
  id: string
  name: string
  abbr: string
  iconUrl: string
  svgFilename: string
}

function allergen(id: string, name: string, abbr: string, svgFilename: string): Allergen {
  return { id, name, abbr, svgFilename, iconUrl: `${ALLERGEN_CDN_BASE}/${svgFilename}` }
}

export const allergensLibrary: Allergen[] = [
  allergen("gluten",       "Gluten",       "GLUT", "wheat.svg"),
  allergen("peanuts",      "Peanuts",      "PNUT", "peanut.svg"),
  allergen("dairy",        "Dairy",        "MILK", "milk_bottle.svg"),
  allergen("eggs",         "Eggs",         "EGGS", "cracked_egg.svg"),
  allergen("fish",         "Fish",         "FISH", "fish_silhouette.svg"),
  allergen("crustaceans",  "Crustaceans",  "CRUS", "shrimp.svg"),
  allergen("mollusks",     "Mollusks",     "MOLL", "mollusk.svg"),
  allergen("soy",          "Soy",          "SOY",  "soybean_pod.svg"),
  allergen("sulfites",     "Sulfites",     "SULF", "beaker_e220.svg"),
  allergen("mustard",      "Mustard",      "MSTR", "mustard_plant.svg"),
  allergen("celery",       "Celery",       "CELR", "celery_stalks.svg"),
  allergen("sesame",       "Sesame",       "SESM", "sesame_seeds.svg"),
  allergen("lupin",        "Lupin",        "LUPN", "lupin_flower.svg"),
  allergen("corn",         "Corn",         "CORN", "corn_cob.svg"),
  allergen("honey",        "Honey",        "HONY", "honeycomb.svg"),
]

export function searchAllergens(query: string): Allergen[] {
  if (!query.trim()) {
    return allergensLibrary
  }
  const lowerQuery = query.toLowerCase()
  return allergensLibrary.filter(allergen =>
    allergen.name.toLowerCase().includes(lowerQuery) ||
    allergen.abbr.toLowerCase().includes(lowerQuery) ||
    allergen.id.toLowerCase().includes(lowerQuery)
  )
}

export function getAllergenById(id: string): Allergen | undefined {
  return allergensLibrary.find(allergen => allergen.id === id)
}

export function getAllergensByIds(ids: string[]): Allergen[] {
  return ids.map(id => getAllergenById(id)).filter(Boolean) as Allergen[]
}
