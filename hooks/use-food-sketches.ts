"use client"

import { useState, useEffect, useMemo } from "react"

const MANIFEST_URL =
  "https://cdn.jsdelivr.net/gh/johngoodmankw/keep-warm/food-sketches-manifest.json"
const CACHE_KEY = "kw-sketch-manifest-v1"

export type SketchManifest = Record<string, string>

export function useFoodSketches() {
  const [manifest, setManifest] = useState<SketchManifest>(() => {
    // Hydrate immediately from localStorage so the UI is never blank on reload
    if (typeof window === "undefined") return {}
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : {}
    } catch {
      return {}
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchManifest() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(MANIFEST_URL)
        if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`)
        const data: SketchManifest = await res.json()
        if (!cancelled) {
          setManifest(data)
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch {}
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to fetch sketch manifest"
          // If we already have a cached manifest, don't show an error — just use the cache
          setManifest((prev) => {
            if (Object.keys(prev).length > 0) return prev
            setError(msg)
            return prev
          })
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchManifest()
    return () => { cancelled = true }
  }, [])

  // Sort once when manifest changes — not on every render
  const sketchNames = useMemo(() => Object.keys(manifest).sort(), [manifest])

  const getSketchUrl = useMemo(
    () => (nameOrFilename: string): string | null => {
      const key = nameOrFilename.replace(/\.svg$/i, "")
      return manifest[key] ?? null
    },
    [manifest]
  )

  return { manifest, sketchNames, isLoading, error, getSketchUrl }
}
