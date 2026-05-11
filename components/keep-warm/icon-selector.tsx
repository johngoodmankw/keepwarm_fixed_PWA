"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Search, Check, ChevronDown } from "lucide-react"
import { allergensLibrary, searchAllergens, type Allergen } from "@/lib/keep-warm/allergens-library"
import { dietaryLibrary, searchDietary, type DietaryPreference } from "@/lib/keep-warm/dietary-library"

type IconItem = (Allergen | DietaryPreference) & { type: "allergen" | "dietary" }

interface IconSelectorProps {
  selectedAllergens: string[]
  selectedDietary: string[]
  onAllergensChange: (allergens: string[]) => void
  onDietaryChange: (dietary: string[]) => void
}

const ICON_COLORS = {
  fill: "#FFD700",
  border: "#1C1C1C",
  bronze: "#CD7F32",
}

// Module-level lookup map — built once, never re-allocated
const ICON_BY_ID = new Map<string, Allergen | DietaryPreference>([
  ...allergensLibrary.map((a): [string, Allergen] => [a.id, a]),
  ...dietaryLibrary.map((d): [string, DietaryPreference] => [d.id, d]),
])

export function IconSelector({
  selectedAllergens,
  selectedDietary,
  onAllergensChange,
  onDietaryChange
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "allergens" | "dietary">("all")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredItems = useMemo((): IconItem[] => {
    const allergenResults = searchAllergens(searchQuery)
      .map((a): IconItem => ({ ...a, type: "allergen" }))
      .sort((a, b) => a.name.localeCompare(b.name))
    const dietaryResults = searchDietary(searchQuery)
      .map((d): IconItem => ({ ...d, type: "dietary" }))
      .sort((a, b) => a.name.localeCompare(b.name))

    switch (activeTab) {
      case "allergens": return allergenResults
      case "dietary":   return dietaryResults
      default:          return [...allergenResults, ...dietaryResults]
    }
  }, [searchQuery, activeTab])

  const toggleItem = (item: IconItem) => {
    if (item.type === "allergen") {
      onAllergensChange(
        selectedAllergens.includes(item.id)
          ? selectedAllergens.filter(id => id !== item.id)
          : [...selectedAllergens, item.id]
      )
    } else {
      onDietaryChange(
        selectedDietary.includes(item.id)
          ? selectedDietary.filter(id => id !== item.id)
          : [...selectedDietary, item.id]
      )
    }
  }

  const isSelected = (item: IconItem) =>
    item.type === "allergen"
      ? selectedAllergens.includes(item.id)
      : selectedDietary.includes(item.id)

  const totalSelected = selectedAllergens.length + selectedDietary.length

  const renderIconPreview = (item: IconItem) => (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: ICON_COLORS.fill, border: `2px solid ${ICON_COLORS.border}` }}
    >
      <img src={item.iconUrl} alt={item.name} className="w-4 h-4 object-contain" />
    </div>
  )

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
        Allergens & Dietary Icons
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 rounded-xl bg-white border border-[#D5D5D5] text-[#1C1C1C] focus:outline-none focus:border-[#C6A66A] focus:ring-1 focus:ring-[#C6A66A] transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {totalSelected > 0 ? (
            <>
              <div className="flex items-center -space-x-1.5">
                {[...selectedAllergens.slice(0, 2), ...selectedDietary.slice(0, 2)]
                  .slice(0, 4)
                  .map((id, idx) => {
                    const item = ICON_BY_ID.get(id)
                    if (!item) return null
                    return (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: ICON_COLORS.fill, border: `1.5px solid ${ICON_COLORS.border}` }}
                      >
                        <img src={item.iconUrl} alt={item.name} className="w-3 h-3 object-contain" />
                      </div>
                    )
                  })}
              </div>
              <span className="text-sm text-[#6B6B6B]">{totalSelected} selected</span>
            </>
          ) : (
            <span className="text-sm text-[#9B9B9B]">Select allergens & dietary icons...</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-[#6B6B6B] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="w-full mt-2 bg-white border border-[#D5D5D5] rounded-xl shadow-xl overflow-hidden max-h-96">
          <div className="p-3 border-b border-[#E8E4DE]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search allergens & dietary..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#F5F2ED] border-0 text-sm text-[#1C1C1C] placeholder:text-[#9B9B9B] focus:outline-none focus:ring-2 focus:ring-[#C6A66A]/50"
              />
            </div>
          </div>

          <div className="flex border-b border-[#E8E4DE]">
            {(["all", "allergens", "dietary"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  activeTab === tab
                    ? "text-[#CD7F32] border-b-2 border-[#CD7F32]"
                    : "text-[#6B6B6B] hover:text-[#1C1C1C]"
                }`}
              >
                {tab === "all" ? "All" : tab === "allergens" ? "Allergens" : "Dietary"}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-60 p-2">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#9B9B9B]">No items found</div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {filteredItems.map((item) => {
                  const selected = isSelected(item)
                  return (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => toggleItem(item)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                        selected ? "bg-[#FFD700]/10" : "hover:bg-[#F5F2ED]"
                      }`}
                    >
                      <div className="relative">
                        {renderIconPreview(item)}
                        {selected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#CD7F32] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-[#1C1C1C] text-center leading-tight line-clamp-2">
                        {item.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {totalSelected > 0 && (
            <div className="p-3 border-t border-[#E8E4DE] bg-[#F5F2ED]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B6B6B]">
                  {totalSelected} icon{totalSelected > 1 ? "s" : ""} selected
                </span>
                <button
                  type="button"
                  onClick={() => { onAllergensChange([]); onDietaryChange([]) }}
                  className="text-xs font-semibold text-[#CD7F32] hover:text-[#B8732D] transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected icons chip row */}
      {totalSelected > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {[...selectedAllergens, ...selectedDietary].map((id) => {
            const item = ICON_BY_ID.get(id)
            if (!item) return null
            return (
              <div
                key={id}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{ backgroundColor: `${ICON_COLORS.fill}20`, border: `1.5px solid ${ICON_COLORS.bronze}` }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: ICON_COLORS.fill, border: `1.5px solid ${ICON_COLORS.border}` }}
                >
                  <img src={item.iconUrl} alt={item.name} className="w-3 h-3 object-contain" />
                </div>
                <span className="text-xs font-medium text-[#1C1C1C]">{item.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedAllergens.includes(id)) {
                      onAllergensChange(selectedAllergens.filter(a => a !== id))
                    } else {
                      onDietaryChange(selectedDietary.filter(d => d !== id))
                    }
                  }}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#E8E4DE] transition-colors"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
