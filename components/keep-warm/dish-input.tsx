"use client"

import { useState, useMemo, useRef } from "react"
import { Search, Plus, Save } from "lucide-react"
import { searchMenuItems, type MenuItem } from "@/lib/keep-warm/menu-library"

interface DishInputProps {
  value: string
  onChange: (value: string) => void
  onMenuItemSelect?: (item: MenuItem | null) => void
  isCustomMode?: boolean
  onCustomModeChange?: (isCustom: boolean) => void
  onSaveToLibrary?: () => void
}

export function DishInput({
  value,
  onChange,
  onMenuItemSelect,
  isCustomMode = false,
  onCustomModeChange,
  onSaveToLibrary
}: DishInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // useMemo instead of useEffect+setState — no extra render cycle on every keystroke
  const filtered = useMemo(
    () => searchMenuItems(searchQuery || value),
    [searchQuery, value]
  )

  const handleSelect = (item: MenuItem) => {
    if (item.id === "custom") {
      onChange("")
      onCustomModeChange?.(true)
      onMenuItemSelect?.(null)
    } else {
      onChange(item.name)
      onCustomModeChange?.(false)
      onMenuItemSelect?.(item)
    }
    setIsOpen(false)
    setSearchQuery("")
    inputRef.current?.blur()
  }

  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    setSearchQuery(newValue)
    if (!isOpen && newValue.length > 0) setIsOpen(true)
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Dish Name</label>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={isCustomMode ? "Type custom dish name..." : "Search menu library..."}
          className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-[#D5D5D5] text-[#1C1C1C] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#C6A66A] focus:ring-1 focus:ring-[#C6A66A] transition-all"
        />
      </div>

      {isCustomMode && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#FFD700]/20 border border-[#CD7F32]/30">
            <Plus className="w-3 h-3 text-[#CD7F32]" />
            <span className="text-[10px] font-semibold text-[#CD7F32]">Custom Entry</span>
          </div>
          {value.length > 0 && (
            <button
              type="button"
              onClick={onSaveToLibrary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1C1C] text-white hover:bg-[#2A2A2A] transition-colors"
            >
              <Save className="w-3 h-3" />
              <span className="text-[10px] font-semibold">Save to Library</span>
            </button>
          )}
        </div>
      )}

      {isOpen && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-20 w-full mt-2 bg-white border border-[#D5D5D5] rounded-xl shadow-lg overflow-hidden max-h-72 overflow-y-auto"
        >
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseDown={() => handleSelect(item)}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  item.id === "custom"
                    ? "bg-[#FFD700]/10 hover:bg-[#FFD700]/20 border-b border-[#E8E4DE]"
                    : "hover:bg-[#F5F2ED]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.id === "custom" && <Plus className="w-4 h-4 text-[#CD7F32]" />}
                      <span className={`text-sm font-medium ${item.id === "custom" ? "text-[#CD7F32]" : "text-[#1C1C1C]"}`}>
                        {item.name}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                  {item.allergens.length > 0 && (
                    <div className="flex items-center gap-1">
                      {item.allergens.slice(0, 3).map((allergen, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                          style={{ backgroundColor: "#FFD700", border: "1.5px solid #1C1C1C", color: "#1C1C1C" }}
                        >
                          {allergen.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {item.allergens.length > 3 && (
                        <span className="text-[10px] text-[#6B6B6B]">+{item.allergens.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
