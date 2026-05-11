"use client"

import { useState, useMemo, useRef } from "react"
import { Search, Grid3X3, List, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import type { SketchManifest } from "@/hooks/use-food-sketches"

interface FoodSketchBrowserProps {
  selectedSketch: string | null
  onSketchSelect: (name: string | null) => void
  // Passed from page.tsx — no second fetch
  sketchNames: string[]
  isLoading: boolean
  error: string | null
  getSketchUrl: (name: string) => string | null
}

const ITEMS_PER_PAGE = 12

export function FoodSketchBrowser({
  selectedSketch,
  onSketchSelect,
  sketchNames,
  isLoading,
  error,
  getSketchUrl,
}: FoodSketchBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPage(0)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 150)
  }

  const filteredNames = useMemo(() => {
    if (!debouncedQuery) return sketchNames
    const q = debouncedQuery.toLowerCase()
    return sketchNames.filter(name => name.toLowerCase().includes(q))
  }, [sketchNames, debouncedQuery])

  const totalPages = Math.ceil(filteredNames.length / ITEMS_PER_PAGE)
  const paginatedNames = filteredNames.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  if (isLoading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Food Sketch</label>
        <div className="flex flex-col items-center justify-center py-12 bg-[#FAFAFA] rounded-xl border border-[#E8E4DE]">
          <Loader2 className="w-8 h-8 text-[#CD7F32] animate-spin mb-3" />
          <span className="text-sm font-medium text-[#6B6B6B]">Syncing Sketches...</span>
          <span className="text-xs text-[#9B9B9B] mt-1">Loading from library</span>
        </div>
      </div>
    )
  }

  if (error && sketchNames.length === 0) {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Food Sketch</label>
        <div className="flex flex-col items-center justify-center py-8 bg-red-50 rounded-xl border border-red-200">
          <span className="text-sm font-medium text-red-600">Failed to load sketches</span>
          <span className="text-xs text-red-400 mt-1">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Food Sketch</label>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search food sketches..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D5D5D5] text-sm text-[#1C1C1C] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#CD7F32] focus:ring-1 focus:ring-[#CD7F32]"
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#6B6B6B]">
          {filteredNames.length} sketch{filteredNames.length !== 1 ? "es" : ""} found
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#E8E4DE]" : "hover:bg-[#E8E4DE]"}`}
          >
            <Grid3X3 className="w-4 h-4 text-[#1C1C1C]" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded ${viewMode === "list" ? "bg-[#E8E4DE]" : "hover:bg-[#E8E4DE]"}`}
          >
            <List className="w-4 h-4 text-[#1C1C1C]" />
          </button>
        </div>
      </div>

      {paginatedNames.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#9B9B9B]">
          No sketches found for your search
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-4 gap-2">
          {paginatedNames.map(name => {
            const url = getSketchUrl(name)
            const isSelected = selectedSketch === name
            return (
              <button
                key={name}
                onClick={() => onSketchSelect(isSelected ? null : name)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-[69px] h-[69px] rounded flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? "bg-[#FFD700] border-2 border-[#1C1C1C]"
                      : "bg-[#FAFAFA] border border-[#E8E4DE] hover:border-[#CD7F32]"
                  }`}
                >
                  {url ? (
                    <img
                      src={url}
                      alt={name}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[8px] text-[#9B9B9B]">?</span>
                  )}
                </div>
                <span className="text-[10px] text-[#6B6B6B] text-center line-clamp-1">{name}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {paginatedNames.map(name => {
            const url = getSketchUrl(name)
            const isSelected = selectedSketch === name
            return (
              <button
                key={name}
                onClick={() => onSketchSelect(isSelected ? null : name)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#FFD700]/20 border border-[#CD7F32]"
                    : "bg-white border border-[#E8E4DE] hover:border-[#CD7F32]"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  {url ? (
                    <img src={url} alt={name} loading="lazy" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-[#9B9B9B]">?</span>
                  )}
                </div>
                <span className="flex-1 text-left text-sm font-medium text-[#1C1C1C]">{name}</span>
              </button>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-full hover:bg-[#E8E4DE] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-[#1C1C1C]" />
          </button>
          <span className="text-xs text-[#6B6B6B]">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-full hover:bg-[#E8E4DE] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-[#1C1C1C]" />
          </button>
        </div>
      )}

      {selectedSketch && (
        <div className="mt-3 p-2 rounded-lg bg-[#FFD700]/10 border border-[#CD7F32]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#1C1C1C]">Selected: {selectedSketch}</span>
            <button onClick={() => onSketchSelect(null)} className="text-xs text-[#CD7F32] hover:underline">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
