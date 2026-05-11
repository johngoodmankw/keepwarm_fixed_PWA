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
  selectedSketch?: string | null
  sketchUrl?: string | null
}

const EPAPER_COLORS = {
  black: "#1C1C1C",
  white: "#FFFFFF",
  red: "#FF0000",
  yellow: "#FFD700",
  bronze: "#CD7F32",
}

// Hoisted outside component — stable object reference, no re-allocation on every render
const NOISE_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
}

function isChickenDish(name: string): boolean {
  const keywords = ["chicken", "poultry", "hen", "fowl", "wings", "drumstick", "parm"]
  const lower = name.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

function ChickenParmSketch() {
  return (
    <svg className="w-20 h-20 mb-2" viewBox="0 0 80 80" fill="none"
      stroke={EPAPER_COLORS.black} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="62" rx="32" ry="10" />
      <ellipse cx="40" cy="62" rx="24" ry="6" strokeWidth="1.5" opacity="0.5" />
      <path d="M16 48c4-10 14-16 24-16s20 6 24 16c2 5 1 10-3 13s-10 5-21 5-17-2-21-5-5-8-3-13z" />
      <path d="M22 44c3-2 6-3 10-3" strokeWidth="1.5" />
      <path d="M48 44c3 0 6 1 8 3" strokeWidth="1.5" />
      <path d="M28 50c4-1 8-1 12 0" strokeWidth="1.5" />
      <path d="M42 50c4 1 8 0 10-1" strokeWidth="1.5" />
      <path d="M24 40c2-3 8-5 16-5s14 2 16 5" strokeWidth="2.5" />
      <path d="M26 38c0-2 4-4 14-4s14 2 14 4" strokeWidth="1.5" opacity="0.6" />
      <path d="M20 46c-2 2-3 5-2 7" strokeWidth="2.5" />
      <path d="M60 46c2 2 3 5 2 7" strokeWidth="2.5" />
      <ellipse cx="40" cy="36" rx="4" ry="3" strokeWidth="2.5" />
      <path d="M40 33v-3" strokeWidth="1.5" />
      <path d="M38 35c-2-1-3-2-3-3" strokeWidth="1.5" />
      <path d="M42 35c2-1 3-2 3-3" strokeWidth="1.5" />
      <path d="M30 20c0-4 2-7 1-10" strokeWidth="2.5" opacity="0.6" />
      <path d="M40 18c0-4 2-7 1-10" strokeWidth="2.5" opacity="0.6" />
      <path d="M50 20c0-4 2-7 1-10" strokeWidth="2.5" opacity="0.6" />
    </svg>
  )
}

function SteakSketch() {
  return (
    <svg className="w-20 h-20 mb-2" viewBox="0 0 80 80" fill="none"
      stroke={EPAPER_COLORS.black} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="40" cy="62" rx="32" ry="10" />
      <ellipse cx="40" cy="62" rx="24" ry="6" strokeWidth="1.5" opacity="0.5" />
      <path d="M14 46c3-10 12-16 26-16s23 6 26 16c2 5 0 9-4 12s-12 5-22 5-18-2-22-5-6-7-4-12z" />
      <path d="M14 46c2-4 5-6 10-6" strokeWidth="2.5" />
      <path d="M66 46c-2-4-5-6-10-6" strokeWidth="2.5" />
      <path d="M24 40c6 3 14 3 22 0" />
      <path d="M20 48c8 3 18 3 28 0" />
      <path d="M24 54c6 2 12 2 18 0" />
      <ellipse cx="40" cy="46" rx="10" ry="6" strokeWidth="1.5" opacity="0.4" />
      <path d="M30 18c0-4 2-7 1-10" strokeWidth="2.5" opacity="0.6" />
      <path d="M40 16c0-4 2-7 1-10" strokeWidth="2.5" opacity="0.6" />
      <path d="M50 18c0-4 2-7 1-10" strokeWidth="2.5" opacity="0.6" />
      <path d="M14 58c-3-2-4-5-3-6" strokeWidth="2.5" />
      <path d="M13 56c-2 0-4-1-4-2" strokeWidth="1.5" />
      <path d="M13 56c-1-2-1-4 0-5" strokeWidth="1.5" />
      <ellipse cx="44" cy="42" rx="5" ry="2.5" strokeWidth="2.5" />
    </svg>
  )
}

export function PreviewCard({
  dishName,
  description,
  allergens,
  dietary,
  logoUrl = null,
  selectedSketch = null,
  sketchUrl = null,
}: PreviewCardProps) {
  const allIconIds = [...allergens, ...dietary].slice(0, 5)
  const showChicken = selectedSketch?.includes("chicken") || isChickenDish(dishName)

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
          {/* Noise texture — stable style reference, no re-paint on parent re-render */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={NOISE_STYLE} />

          <div className="relative h-full flex flex-col p-3">
            {/* Zone A — Hotel Logo */}
            <div className="h-[15%] flex items-center justify-center border-b border-[#1C1C1C]/10 pb-2">
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

            {/* Zone B — Central Illustration & Dish Info */}
            <div className="h-[55%] flex flex-col items-center justify-center text-center px-2">
              {sketchUrl ? (
                <img src={sketchUrl} alt={selectedSketch ?? "food sketch"} className="w-20 h-20 mb-2 object-contain" />
              ) : selectedSketch ? (
                <div
                  className="w-20 h-20 mb-2 rounded-lg border-2 border-dashed flex items-center justify-center"
                  style={{ borderColor: EPAPER_COLORS.black, opacity: 0.3 }}
                >
                  <span className="text-[10px] font-medium text-center" style={{ color: EPAPER_COLORS.black }}>
                    No Sketch
                  </span>
                </div>
              ) : (
                showChicken ? <ChickenParmSketch /> : <SteakSketch />
              )}
              <h2
                className="text-xl font-black tracking-wide text-balance uppercase leading-tight"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "0.08em", color: EPAPER_COLORS.black }}
              >
                {dishName || "DISH NAME"}
              </h2>
              {description && (
                <p className="mt-1 text-[10px] leading-relaxed max-w-[260px] text-pretty"
                  style={{ color: EPAPER_COLORS.black, opacity: 0.6 }}>
                  {description}
                </p>
              )}
            </div>

            {/* Zone C — Icons with Abbreviations */}
            <div className="h-[30%] border-t border-[#1C1C1C]/10 pt-2">
              <div className="flex items-start justify-center gap-3 flex-wrap">
                {allIconIds.map((iconId, index) => {
                  const iconData = getIconData(iconId)
                  if (!iconData) return null
                  return (
                    <div key={`icon-${index}`} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: EPAPER_COLORS.yellow, border: `2.5px solid ${EPAPER_COLORS.black}` }}
                        title={iconData.name}
                      >
                        <img src={iconData.iconUrl} alt={iconData.name} className="w-4 h-4 object-contain" />
                      </div>
                      <span className="text-[8px] font-bold uppercase" style={{ color: EPAPER_COLORS.black }}>
                        {iconData.abbr}
                      </span>
                    </div>
                  )
                })}
                {allIconIds.length < 5 &&
                  Array.from({ length: 5 - allIconIds.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex flex-col items-center gap-0.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: EPAPER_COLORS.black, opacity: 0.08 }}
                      >
                        <Circle className="w-2 h-2" style={{ color: EPAPER_COLORS.black, opacity: 0.3 }} />
                      </div>
                      <span className="text-[8px] opacity-0">---</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
