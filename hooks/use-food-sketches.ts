"use client"

import { useState, useEffect, useMemo } from "react"
import menuMapping from "@/lib/menu-mapping.json"

// SVG text cached after fetch — files are already processed (no XML declaration, responsive attrs injected)
const SVG_CACHE: Record<string, string | null> = {}

async function fetchSvg(filename: string): Promise<void> {
  if (filename in SVG_CACHE) return
  try {
    const res = await fetch(`/sketches/${filename}`)
    if (!res.ok) throw new Error(`${res.status}`)
    SVG_CACHE[filename] = await res.text()
  } catch {
    SVG_CACHE[filename] = null
  }
}

export function useFoodSketches() {
  const mapping = menuMapping as Record<string, string>

  const allFiles = useMemo(
    () => [...new Set(Object.values(mapping))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [svgMap, setSvgMap] = useState<Record<string, string | null>>({ ...SVG_CACHE })
  const [isLoading, setIsLoading] = useState(allFiles.some(f => !(f in SVG_CACHE)))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const missing = allFiles.filter(f => !(f in SVG_CACHE))
    if (missing.length === 0) return

    let cancelled = false
    Promise.all(missing.map(fetchSvg))
      .then(() => {
        if (!cancelled) {
          setSvgMap({ ...SVG_CACHE })
          setIsLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load sketches")
          setIsLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [allFiles])

  const getSketchSvg = (filename: string | null): string | null => {
    if (!filename) return null
    return svgMap[filename] ?? null
  }

  const galleryItems = useMemo(
    () => Object.entries(mapping).map(([dishName, file]) => ({ dishName, file })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return { getSketchSvg, galleryItems, isLoading, error }
}
