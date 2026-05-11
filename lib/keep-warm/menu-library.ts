// KeepWarm Epaper Manifests - Menu Items Library
// Allergen IDs must match allergens-library.ts exactly
// Dietary IDs must match dietary-library.ts exactly

export interface MenuItem {
  id: string
  name: string
  description: string
  allergens: string[]
  dietary: string[]
  category: string
  sketchType: "chicken" | "steak" | "fish" | "vegetable" | "pasta" | "default"
}

export const menuLibrary: MenuItem[] = [
  {
    id: "custom",
    name: "Custom",
    description: "",
    allergens: [],
    dietary: [],
    category: "custom",
    sketchType: "default"
  },
  {
    id: "chicken-parm",
    name: "Chicken Parmesan",
    description: "Crispy breaded chicken breast, marinara, melted mozzarella, fresh basil",
    allergens: ["gluten", "dairy", "eggs"],
    dietary: [],
    category: "poultry",
    sketchType: "chicken"
  },
  {
    id: "grilled-salmon",
    name: "Grilled Salmon",
    description: "Atlantic salmon, lemon herb butter, seasonal vegetables",
    allergens: ["fish", "dairy"],
    dietary: ["gluten-free"],
    category: "seafood",
    sketchType: "fish"
  },
  {
    id: "ribeye-steak",
    name: "Ribeye Steak",
    description: "Prime ribeye, compound butter, roasted garlic, rosemary",
    allergens: ["dairy"],
    dietary: ["gluten-free"],
    category: "beef",
    sketchType: "steak"
  },
  {
    id: "herb-chicken",
    name: "Herb-Crusted Chicken",
    description: "Free-range chicken, fresh herbs, garlic, lemon zest",
    allergens: ["dairy"],
    dietary: ["gluten-free"],
    category: "poultry",
    sketchType: "chicken"
  },
  {
    id: "braised-short-ribs",
    name: "Braised Short Ribs",
    description: "Slow-braised beef short ribs, red wine reduction, root vegetables",
    allergens: ["gluten"],
    dietary: [],
    category: "beef",
    sketchType: "steak"
  },
  {
    id: "pan-seared-duck",
    name: "Pan-Seared Duck",
    description: "Duck breast, cherry gastrique, wild rice, haricots verts",
    allergens: [],
    dietary: ["gluten-free"],
    category: "poultry",
    sketchType: "chicken"
  },
  {
    id: "roasted-vegetables",
    name: "Roasted Vegetables",
    description: "Seasonal medley, balsamic glaze, fresh herbs, olive oil",
    allergens: [],
    dietary: ["vegan", "gluten-free", "vegetarian"],
    category: "vegetarian",
    sketchType: "vegetable"
  },
  {
    id: "truffle-risotto",
    name: "Truffle Risotto",
    description: "Arborio rice, black truffle, parmesan, white wine",
    allergens: ["dairy"],
    dietary: ["vegetarian"],
    category: "pasta",
    sketchType: "pasta"
  },
  {
    id: "beef-wellington",
    name: "Beef Wellington",
    description: "Filet mignon, mushroom duxelles, puff pastry, red wine jus",
    allergens: ["gluten", "dairy", "eggs"],
    dietary: [],
    category: "beef",
    sketchType: "steak"
  },
  {
    id: "lobster-thermidor",
    name: "Lobster Thermidor",
    description: "Maine lobster, cognac cream sauce, gruyère, duchess potatoes",
    allergens: ["crustaceans", "dairy", "eggs"],
    dietary: ["gluten-free"],
    category: "seafood",
    sketchType: "fish"
  },
  {
    id: "caesar-salad",
    name: "Caesar Salad",
    description: "Romaine hearts, house-made dressing, parmesan, croutons",
    allergens: ["dairy", "gluten", "eggs", "fish"],
    dietary: ["vegetarian"],
    category: "salad",
    sketchType: "vegetable"
  },
  {
    id: "mushroom-pasta",
    name: "Wild Mushroom Pasta",
    description: "Pappardelle, forest mushrooms, truffle cream, pecorino",
    allergens: ["gluten", "dairy"],
    dietary: ["vegetarian"],
    category: "pasta",
    sketchType: "pasta"
  },
  {
    id: "sesame-tuna",
    name: "Sesame-Crusted Tuna",
    description: "Ahi tuna, sesame crust, wasabi aioli, pickled ginger",
    allergens: ["fish", "sesame", "soy", "eggs"],
    dietary: ["gluten-free"],
    category: "seafood",
    sketchType: "fish"
  },
  {
    id: "lamb-chops",
    name: "Lamb Chops",
    description: "New Zealand lamb, mint pesto, roasted fingerlings",
    allergens: ["peanuts"],
    dietary: ["gluten-free"],
    category: "lamb",
    sketchType: "steak"
  }
]

export function searchMenuItems(query: string): MenuItem[] {
  const lowerQuery = query.toLowerCase()

  const customItem = menuLibrary.find(item => item.id === "custom")
  const otherItems = menuLibrary.filter(item => item.id !== "custom")

  if (!query.trim()) {
    return customItem ? [customItem, ...otherItems] : otherItems
  }

  const filtered = otherItems.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  )

  return customItem ? [customItem, ...filtered] : filtered
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuLibrary.find(item => item.id === id)
}
