"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Grid3X3, List, ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react"
import { useFoodSketches } from "@/hooks/use-food-sketches"
import menuMapping from "@/lib/menu-mapping.json"

// ---------------------------------------------------------------------------
// Fuzzy matching — no external library needed for 28 items
// Normalise both strings to lowercase words, score on word-level overlap.
// "Eggs" → "Scrambled Eggs" scores 1.0 because every query word ("eggs")
//   appears in the candidate word list.
// ---------------------------------------------------------------------------
function normalize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
}

function fuzzyFindSketch(
  dishName: string,
  mapping: Record<string, string>,
  sketchNames: string[]
): string | null {
  if (!dishName.trim()) return null

  const queryWords = normalize(dishName)
  if (!queryWords.length) return null

  let bestKey: string | null = null
  let bestScore = 0

  for (const key of Object.keys(mapping)) {
    const candidateWords = normalize(key)

    // Exact normalised match — short-circuit immediately
    if (candidateWords.join(" ") === queryWords.join(" ")) {
      bestKey = key
      break
    }

    // Word-overlap score: what fraction of query words appear in the candidate?
    const matches = queryWords.filter(qw =>
      candidateWords.some(cw => cw.includes(qw) || qw.includes(cw))
    )
    const score = matches.length / Math.max(queryWords.length, candidateWords.length)

    // Require at least 50 % overlap to avoid spurious matches
    if (score > bestScore && score >= 0.5) {
      bestScore = score
      bestKey = key
    }
  }

  if (!bestKey) return null

  // Strip .svg extension so it aligns with manifest keys
  const sketchKey = (mapping as Record<string, string>)[bestKey].replace(/\.svg$/i, "")

  // Accept even if not yet in manifest — getSketchUrl will return null gracefully
  return sketchNames.includes(sketchKey) ? sketchKey : sketchKey
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface FoodSketchBrowserProps {
  dishName?: string           // passed from parent; drives auto-selection
  selectedSketch: string | null
  onSketchSelect: (name: string | null) => void
}

export function FoodSketchBrowser({
  dishName = "",
  selectedSketch,
  onSketchSelect,
}: FoodSketchBrowserProps) {
  const { sketchNames, isLoading, error, getSketchUrl } = useFoodSketches()

  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(0)
  const itemsPerPage = 12

  // Track the last sketch that was auto-selected so manual picks aren't overridden
  const autoSelectedRef = useRef<string | null>(null)
  const [autoMatchLabel, setAutoMatchLabel] = useState<string | null>(null)

  // Auto-select when dishName changes
  useEffect(() => {
    const match = fuzzyFindSketch(dishName, menuMapping as Record<string, string>, sketchNames)

    if (match) {
      // Only override if nothing is selected, or we previously auto-selected
      if (!selectedSketch || selectedSketch === autoSelectedRef.current) {
        autoSelectedRef.current = match
        setAutoMatchLabel(match)
        onSketchSelect(match)

        // Scroll to the matched sketch's page in the grid
        const idx = filteredNames.indexOf(match)
        if (idx !== -1) setPage(Math.floor(idx / itemsPerPage))
      }
    } else if (!dishName.trim() && selectedSketch === autoSelectedRef.current) {
      // Dish name cleared — clear auto-selected sketch too
      autoSelectedRef.current = null
      setAutoMatchLabel(null)
      onSketchSelect(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishName, sketchNames])

  const filteredNames = useMemo(() => {
    if (!searchQuery) return sketchNames
    const q = searchQuery.toLowerCase()
    return sketchNames.filter(name => name.toLowerCase().includes(q))
  }, [sketchNames, searchQuery])

  const totalPages = Math.ceil(filteredNames.length / itemsPerPage)
  const paginatedNames = filteredNames.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  // Manual selection — user takes control; stop auto-overriding
  const handleManualSelect = (name: string | null) => {
    autoSelectedRef.current = name   // treat manual pick as new auto baseline
    setAutoMatchLabel(null)
    onSketchSelect(name)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
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

  // ── Error ──────────────────────────────────────────────────────────────────
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

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Food Sketch</label>

      {/* Auto-match banner */}
      {autoMatchLabel && selectedSketch === autoMatchLabel && (
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

      {/* Search bar */}
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

      {/* View toggle & count */}
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

      {/* Gallery */}
      {paginatedNames.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#9B9B9B]">No sketches found</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-4 gap-2">
          {paginatedNames.map(name => {
            const url = getSketchUrl(name)
            const isSelected = selectedSketch === name
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleManualSelect(isSelected ? null : name)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-[69px] h-[69px] rounded flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? "bg-[#FFD700] border-2 border-[#1C1C1C]"
                      : "bg-[#FAFAFA] border border-[#E8E4DE] hover:border-[#CD7F32]"
                  }`}
                >
                  {url
                    ? <img src={url} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    : <span className="text-[8px] text-[#9B9B9B]">?</span>
                  }
                </div>
                <span className="text-[10px] text-[#6B6B6B] text-center line-clamp-1 w-full">{name}</span>
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
                type="button"
                onClick={() => handleManualSelect(isSelected ? null : name)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-[#FFD700]/20 border border-[#CD7F32]"
                    : "bg-white border border-[#E8E4DE] hover:border-[#CD7F32]"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  {url
                    ? <img src={url} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    : <span className="text-[10px] text-[#9B9B9B]">?</span>
                  }
                </div>
                <span className="flex-1 text-left text-sm font-medium text-[#1C1C1C]">{name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Pagination */}
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

      {/* Selected indicator (manual picks, no auto-match label) */}
      {selectedSketch && selectedSketch !== autoMatchLabel && (
        <div className="mt-3 p-2 rounded-lg bg-[#FFD700]/10 border border-[#CD7F32]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#1C1C1C]">Selected: {selectedSketch}</span>
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