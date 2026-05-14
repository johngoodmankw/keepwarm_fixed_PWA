"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Grid3X3, List, ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react"
import { useFoodSketches } from "@/hooks/use-food-sketches"
import menuMapping from "@/lib/menu-mapping.json"

function fuzzyMatch(query: string, mapping: Record<string, string>): string | null {
  if (!query.trim()) return null
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean)
  const qw = normalize(query)
  if (!qw.length) return null

  let bestKey: string | null = null
  let bestScore = 0

  for (const [dishName, file] of Object.entries(mapping)) {
    const cw = normalize(dishName)
    if (cw.join(" ") === qw.join(" ")) return file
    const matches = qw.filter(w => cw.some(c => c.includes(w) || w.includes(c)))
    const score = matches.length / Math.max(qw.length, cw.length)
    if (score > bestScore && score >= 0.5) { bestScore = score; bestKey = dishName }
  }
  return bestKey ? mapping[bestKey] : null
}

interface FoodSketchBrowserProps {
  dishName?: string
  selectedSketch: string | null
  onSketchSelect: (file: string | null) => void
}

export function FoodSketchBrowser({
  dishName = "",
  selectedSketch,
  onSketchSelect,
}: FoodSketchBrowserProps) {
  const { getSketchSvg, galleryItems, isLoading, error } = useFoodSketches()

  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(0)
  const itemsPerPage = 12

  const autoSelectedRef = useRef<string | null>(null)
  const [autoMatchLabel, setAutoMatchLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!dishName.trim()) {
      if (selectedSketch && selectedSketch === autoSelectedRef.current) {
        autoSelectedRef.current = null
        setAutoMatchLabel(null)
        onSketchSelect(null)
      }
      return
    }

    const rawMap = menuMapping as Record<string, string>
    const file = rawMap[dishName] ?? fuzzyMatch(dishName, rawMap)
    if (!file) return

    if (!selectedSketch || selectedSketch === autoSelectedRef.current) {
      autoSelectedRef.current = file
      setAutoMatchLabel(dishName)
      onSketchSelect(file)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishName])

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return galleryItems
    return galleryItems.filter(({ dishName: label }) => label.toLowerCase().includes(q))
  }, [galleryItems, searchQuery])

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginated = filteredItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  const handleManualSelect = (file: string | null) => {
    autoSelectedRef.current = file
    setAutoMatchLabel(null)
    onSketchSelect(file)
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Food Sketch</label>
        <div className="flex flex-col items-center justify-center py-12 bg-[#FAFAFA] rounded-xl border border-[#E8E4DE]">
          <Loader2 className="w-8 h-8 text-[#CD7F32] animate-spin mb-3" />
          <span className="text-sm font-medium text-[#6B6B6B]">Loading sketches...</span>
        </div>
      </div>
    )
  }

  if (error) {
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

      {autoMatchLabel && selectedSketch === autoSelectedRef.current && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[#FFD700]/15 border border-[#CD7F32]/40">
          <Zap className="w-3.5 h-3.5 text-[#CD7F32] shrink-0" />
          <span className="text-xs font-medium text-[#1C1C1C]">
            Auto-matched: <span className="text-[#CD7F32]">{autoMatchLabel}</span>
          </span>
          <button
            type="button"
            onClick={() => handleManualSelect(null)}
            className="ml-auto text-xs text-[#9B9B9B] hover:text-[#1C1C1C] transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(0) }}
          placeholder="Search food sketches..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D5D5D5] text-sm text-[#1C1C1C] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#CD7F32] focus:ring-1 focus:ring-[#CD7F32]"
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#6B6B6B]">
          {filteredItems.length} sketch{filteredItems.length !== 1 ? "es" : ""}
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

      {paginated.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#9B9B9B]">No sketches found</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-4 gap-2">
          {paginated.map(({ dishName: label, file }) => {
            const svg = getSketchSvg(file)
            const isSelected = selectedSketch === file
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleManualSelect(isSelected ? null : file)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-[69px] h-[69px] rounded flex items-center justify-center transition-all flex-shrink-0 overflow-hidden ${
                  isSelected
                    ? "bg-[#FFD700] border-2 border-[#1C1C1C]"
                    : "bg-[#FAFAFA] border border-[#E8E4DE] hover:border-[#CD7F32]"
                }`}>
                  {svg
                    ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} />
                    : <span className="text-[8px] text-[#9B9B9B]">?</span>
                  }
                </div>
                <span className="text-[10px] text-[#6B6B6B] text-center line-clamp-1 w-full">
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map(({ dishName: label, file }) => {
            const svg = getSketchSvg(file)
            const isSelected = selectedSketch === file
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleManualSelect(isSelected ? null : file)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#FFD700]/20 border border-[#CD7F32]"
                    : "bg-white border border-[#E8E4DE] hover:border-[#CD7F32]"
                }`}
              >
                <div className="w-10 h-10 flex-shrink-0 overflow-hidden">
                  {svg
                    ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} />
                    : <span className="text-[10px] text-[#9B9B9B]">?</span>
                  }
                </div>
                <span className="flex-1 text-left text-sm font-medium text-[#1C1C1C]">{label}</span>
              </button>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-full hover:bg-[#E8E4DE] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-[#1C1C1C]" />
          </button>
          <span className="text-xs text-[#6B6B6B]">Page {page + 1} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-full hover:bg-[#E8E4DE] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-[#1C1C1C]" />
          </button>
        </div>
      )}

      {selectedSketch && selectedSketch !== autoSelectedRef.current && (
        <div className="mt-3 p-2 rounded-lg bg-[#FFD700]/10 border border-[#CD7F32]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#1C1C1C]">
              Selected: {galleryItems.find(i => i.file === selectedSketch)?.dishName ?? selectedSketch}
            </span>
            <button
              type="button"
              onClick={() => handleManualSelect(null)}
              className="text-xs text-[#CD7F32] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
