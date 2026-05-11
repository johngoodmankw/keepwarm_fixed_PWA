// KeepWarm — Menu Library
// Source: KeepWarm Epaper Manifests - Menu Items (5).csv

export interface MenuItem {
  id: string
  name: string
  description: string
  allergens: string[]
  dietary: string[]
  category: string
  sketchType: "chicken" | "steak" | "fish" | "vegetable" | "pasta" | "default"
  sketch: string
  targetTemp: string
}

export const menuLibrary: MenuItem[] = [

  // ── Custom (always first) ──────────────────────────────────────────────────
  {
    id: "custom",
    name: "Custom",
    description: "",
    allergens: [],
    dietary: [],
    category: "custom",
    sketchType: "default",
    sketch: "",
    targetTemp: "",
  },

  // ── Breakfast ──────────────────────────────────────────────────────────────
  {
    id: "pork-sausage-links",
    name: "Pork Sausage Links",
    description: "Seasoned pork sausage links, griddled to order",
    allergens: [],
    dietary: [],
    category: "breakfast",
    sketchType: "steak",
    sketch: "sausage",
    targetTemp: "160°F",
  },
  {
    id: "turkey-bacon",
    name: "Turkey Bacon",
    description: "Lean turkey bacon, crispy and golden",
    allergens: [],
    dietary: [],
    category: "breakfast",
    sketchType: "steak",
    sketch: "bacon-strips",
    targetTemp: "165°F",
  },
  {
    id: "corned-beef-hash",
    name: "Corned Beef Hash",
    description: "House-made corned beef hash with diced potatoes and onions",
    allergens: [],
    dietary: [],
    category: "breakfast",
    sketchType: "steak",
    sketch: "hash-bowl",
    targetTemp: "165°F",
  },
  {
    id: "scrambled-eggs",
    name: "Scrambled Eggs",
    description: "Soft scrambled eggs, fresh chives, sea salt",
    allergens: ["eggs", "dairy"],
    dietary: [],
    category: "breakfast",
    sketchType: "default",
    sketch: "eggs-scrambled",
    targetTemp: "165°F",
  },
  {
    id: "eggs-benedict",
    name: "Eggs Benedict",
    description: "Poached eggs, Canadian bacon, toasted English muffin, hollandaise",
    allergens: ["eggs", "dairy", "gluten"],
    dietary: [],
    category: "breakfast",
    sketchType: "default",
    sketch: "benedict",
    targetTemp: "165°F",
  },
  {
    id: "vegetable-frittata",
    name: "Vegetable Frittata",
    description: "Oven-baked frittata with seasonal vegetables, herbs, and cheese",
    allergens: ["eggs", "dairy"],
    dietary: ["vegetarian"],
    category: "breakfast",
    sketchType: "vegetable",
    sketch: "frittata-slice",
    targetTemp: "165°F",
  },
  {
    id: "biscuits-gravy",
    name: "Biscuits & Gravy",
    description: "Buttermilk biscuits, house-made sausage cream gravy",
    allergens: ["dairy", "gluten"],
    dietary: [],
    category: "breakfast",
    sketchType: "default",
    sketch: "biscuits",
    targetTemp: "165°F",
  },
  {
    id: "brioche-french-toast",
    name: "Brioche French Toast",
    description: "Thick-cut brioche, vanilla custard, maple syrup, powdered sugar",
    allergens: ["eggs", "dairy", "gluten"],
    dietary: [],
    category: "breakfast",
    sketchType: "default",
    sketch: "french-toast",
    targetTemp: "150°F",
  },

  // ── Lunch ──────────────────────────────────────────────────────────────────
  {
    id: "chicken-piccata",
    name: "Chicken Piccata",
    description: "Pan-seared chicken breast, lemon-caper butter sauce, angel hair pasta",
    allergens: ["dairy", "gluten"],
    dietary: [],
    category: "lunch",
    sketchType: "chicken",
    sketch: "lemon-chicken",
    targetTemp: "165°F",
  },
  {
    id: "beef-sliders",
    name: "Beef Sliders",
    description: "Mini beef patties, cheddar, house pickles, brioche buns",
    allergens: ["gluten"],
    dietary: [],
    category: "lunch",
    sketchType: "steak",
    sketch: "slider-trio",
    targetTemp: "160°F",
  },
  {
    id: "meatballs-in-marinara",
    name: "Meatballs in Marinara",
    description: "Hand-rolled beef and pork meatballs, San Marzano tomato sauce",
    allergens: ["gluten", "dairy"],
    dietary: [],
    category: "lunch",
    sketchType: "default",
    sketch: "meatballs",
    targetTemp: "165°F",
  },
  {
    id: "fried-cod-filets",
    name: "Fried Cod Filets",
    description: "Beer-battered Atlantic cod, tartar sauce, lemon wedge",
    allergens: ["fish", "gluten"],
    dietary: [],
    category: "lunch",
    sketchType: "fish",
    sketch: "fried-fish",
    targetTemp: "145°F",
  },
  {
    id: "popcorn-shrimp",
    name: "Popcorn Shrimp",
    description: "Crispy bite-sized shrimp, house seasoning, cocktail sauce",
    allergens: ["crustaceans", "gluten"],
    dietary: [],
    category: "lunch",
    sketchType: "fish",
    sketch: "fried-shrimp",
    targetTemp: "145°F",
  },
  {
    id: "macaroni-cheese",
    name: "Macaroni & Cheese",
    description: "Cavatappi pasta, four-cheese béchamel, toasted breadcrumb crust",
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"],
    category: "lunch",
    sketchType: "pasta",
    sketch: "mac-cheese-bowl",
    targetTemp: "165°F",
  },
  {
    id: "penne-alla-vodka",
    name: "Penne Alla Vodka",
    description: "Penne rigate, pink vodka cream sauce, pancetta, fresh basil",
    allergens: ["dairy", "gluten"],
    dietary: [],
    category: "lunch",
    sketchType: "pasta",
    sketch: "pasta-penne",
    targetTemp: "165°F",
  },
  {
    id: "garlic-mashed-spuds",
    name: "Garlic Mashed Spuds",
    description: "Yukon Gold potatoes, roasted garlic, butter, cream",
    allergens: ["dairy"],
    dietary: ["vegetarian", "gluten-free"],
    category: "lunch",
    sketchType: "default",
    sketch: "mashed-potatoes",
    targetTemp: "155°F",
  },
  {
    id: "tomato-basil-soup",
    name: "Tomato Basil Soup",
    description: "Roasted Roma tomatoes, fresh basil, cream",
    allergens: ["dairy"],
    dietary: ["vegetarian", "gluten-free"],
    category: "lunch",
    sketchType: "default",
    sketch: "soup-bowl",
    targetTemp: "170°F",
  },

  // ── Dinner ─────────────────────────────────────────────────────────────────
  {
    id: "braised-short-ribs",
    name: "Braised Short Ribs",
    description: "48-hour braised beef short ribs, red wine reduction, creamy polenta",
    allergens: [],
    dietary: [],
    category: "dinner",
    sketchType: "steak",
    sketch: "short-rib",
    targetTemp: "165°F",
  },
  {
    id: "pan-seared-salmon",
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon fillet, lemon herb butter, asparagus, wild rice",
    allergens: ["fish"],
    dietary: ["gluten-free"],
    category: "dinner",
    sketchType: "fish",
    sketch: "salmon-fillet",
    targetTemp: "145°F",
  },
  {
    id: "shrimp-scampi",
    name: "Shrimp Scampi",
    description: "Gulf shrimp, white wine, garlic butter, linguine, parsley",
    allergens: ["crustaceans", "dairy"],
    dietary: [],
    category: "dinner",
    sketchType: "fish",
    sketch: "shrimp-scampi",
    targetTemp: "145°F",
  },
  {
    id: "steamed-mussels",
    name: "Steamed Mussels",
    description: "PEI mussels, white wine broth, shallots, fresh herbs, crusty bread",
    allergens: ["mollusks"],
    dietary: [],
    category: "dinner",
    sketchType: "fish",
    sketch: "mussels-bowl",
    targetTemp: "145°F",
  },
  {
    id: "vegetable-lasagna",
    name: "Vegetable Lasagna",
    description: "Layered pasta, roasted vegetables, ricotta, béchamel, marinara",
    allergens: ["dairy", "gluten"],
    dietary: ["vegetarian"],
    category: "dinner",
    sketchType: "vegetable",
    sketch: "lasagna-slice",
    targetTemp: "165°F",
  },
  {
    id: "mushroom-risotto",
    name: "Mushroom Risotto",
    description: "Arborio rice, wild mushrooms, parmesan, white wine, truffle oil",
    allergens: ["dairy"],
    dietary: ["vegetarian", "gluten-free"],
    category: "dinner",
    sketchType: "pasta",
    sketch: "risotto-bowl",
    targetTemp: "155°F",
  },

  // ── Dessert ────────────────────────────────────────────────────────────────
  {
    id: "apple-cobbler",
    name: "Apple Cobbler",
    description: "Cinnamon-spiced apples, buttery biscuit topping, vanilla ice cream",
    allergens: ["gluten"],
    dietary: [],
    category: "dessert",
    sketchType: "default",
    sketch: "apple-cobbler",
    targetTemp: "145°F",
  },
  {
    id: "chocolate-bread-pud",
    name: "Chocolate Bread Pud",
    description: "Brioche bread pudding, dark chocolate custard, bourbon caramel",
    allergens: ["dairy", "eggs", "gluten"],
    dietary: [],
    category: "dessert",
    sketchType: "default",
    sketch: "bread-pudding",
    targetTemp: "155°F",
  },
  {
    id: "sticky-toffee-pud",
    name: "Sticky Toffee Pud",
    description: "Date sponge cake, warm toffee sauce, clotted cream",
    allergens: ["dairy", "eggs", "gluten"],
    dietary: [],
    category: "dessert",
    sketchType: "default",
    sketch: "toffee-cake",
    targetTemp: "155°F",
  },
  {
    id: "molten-lava-cake",
    name: "Molten Lava Cake",
    description: "Warm chocolate cake, liquid center, vanilla bean ice cream",
    allergens: ["dairy", "eggs", "gluten"],
    dietary: [],
    category: "dessert",
    sketchType: "default",
    sketch: "lava-cake",
    targetTemp: "150°F",
  },
  {
    id: "cinnamon-churros",
    name: "Cinnamon Churros",
    description: "Crispy fried dough, cinnamon sugar, warm chocolate dipping sauce",
    allergens: ["gluten"],
    dietary: [],
    category: "dessert",
    sketchType: "default",
    sketch: "churros",
    targetTemp: "140°F",
  },
]

// ── Search ───────────────────────────────────────────────────────────────────

export function searchMenuItems(query: string): MenuItem[] {
  const customItem = menuLibrary.find(item => item.id === "custom")!
  const otherItems = menuLibrary.filter(item => item.id !== "custom")

  if (!query.trim()) return [customItem, ...otherItems]

  const q = query.toLowerCase()
  const filtered = otherItems.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  )

  return [customItem, ...filtered]
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuLibrary.find(item => item.id === id)
}