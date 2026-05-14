"use client"

import { Circle } from "lucide-react"
import { allergensLibrary } from "@/lib/keep-warm/allergens-library"
import { dietaryLibrary } from "@/lib/keep-warm/dietary-library"

interface PreviewCardProps {
  dishName: string
  description: string
  allergens: string[]
  dietary: string[]
  logoUrl?: string | null
  sketchSvg?: string | null
  targetTemp?: string | null
}

const EPAPER_COLORS = {
  black: "#1C1C1C",
  white: "#FFFFFF",
  red: "#FF0000",
  yellow: "#FFD700",
  bronze: "#CD7F32",
}

const NOISE_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
}

export function PreviewCard({
  dishName,
  description,
  allergens,
  dietary,
  logoUrl = null,
  sketchSvg = null,
  targetTemp = null,
}: PreviewCardProps) {
  const allIconIds = [...allergens, ...dietary].slice(0, 5)
  const hasSketch = Boolean(sketchSvg)

  const getIconData = (id: string) => {
    const a = allergensLibrary.find(a => a.id === id)
    if (a) return { ...a, type: "allergen" }
    const d = dietaryLibrary.find(d => d.id === id)
    if (d) return { ...d, type: "dietary" }
    return null
  }

  return (
    <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto">
      <div
        className="absolute inset-0 rounded-2xl bg-[#2A2A2A] p-2"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)" }}
      >
        <div
          className="relative w-full h-full rounded-xl overflow-hidden"
          style={{ backgroundColor: EPAPER_COLORS.white, boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={NOISE_STYLE} />

          <div className="relative h-full flex flex-col p-3">

            {/* Zone A — Hotel Logo */}
            <div className="h-[15%] flex items-center justify-center border-b border-[#1C1C1C]/10 pb-2 shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Hotel Logo"
                  className="max-h-full max-w-[60%] object-contain"
                  style={{ filter: "grayscale(100%) contrast(1.2)" }}
                />
              ) : (
                <div className="flex items-center gap-2 opacity-40">
                  <div className="w-4 h-4 rounded-sm" style={{ border: `2px solid ${EPAPER_COLORS.black}` }} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: EPAPER_COLORS.black }}>
                    Brand Image
                  </span>
                </div>
              )}
            </div>

            {/* Zone B — Sketch + Dish Name + Description */}
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-2 overflow-hidden gap-1">
              {hasSketch && (
                <div
                  className="shrink-0 overflow-hidden"
                  style={{ width: 80, height: 80 }}
                  dangerouslySetInnerHTML={{ __html: sketchSvg! }}
                />
              )}

              <h2
                className="text-2xl font-bold uppercase leading-tight shrink-0"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  letterSpacing: "0.05em",
                  color: EPAPER_COLORS.black,
                }}
              >
                {dishName || "DISH NAME"}
              </h2>

              {description && (
                <p
                  className="text-[9px] leading-relaxed max-w-[240px] line-clamp-2 shrink-0"
                  style={{ color: EPAPER_COLORS.black, opacity: 0.55 }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Zone C — Allergens + Temperature */}
            <div className="border-t border-[#1C1C1C]/10 pt-2 shrink-0 flex flex-col items-center gap-1.5 pb-1">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {allIconIds.map((iconId, index) => {
                  const iconData = getIconData(iconId)
                  if (!iconData) return null
                  return (
                    <div key={`icon-${index}`} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: EPAPER_COLORS.yellow, border: `2px solid ${EPAPER_COLORS.black}` }}
                        title={iconData.name}
                      >
                        <img src={iconData.iconUrl} alt={iconData.name} className="w-3.5 h-3.5 object-contain" />
                      </div>
                      <span className="text-[7px] font-bold uppercase" style={{ color: EPAPER_COLORS.black }}>
                        {iconData.abbr}
                      </span>
                    </div>
                  )
                })}

                {allIconIds.length < 5 &&
                  Array.from({ length: 5 - allIconIds.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: EPAPER_COLORS.black, opacity: 0.08 }}
                      >
                        <Circle className="w-2 h-2" style={{ color: EPAPER_COLORS.black, opacity: 0.3 }} />
                      </div>
                      <span className="text-[7px] opacity-0">---</span>
                    </div>
                  ))
                }
              </div>

              {targetTemp && (
                <div className="flex justify-center">
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: EPAPER_COLORS.yellow, border: `1.5px solid ${EPAPER_COLORS.black}` }}
                  >
                    <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: EPAPER_COLORS.black }}>
                      Hold {targetTemp}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
