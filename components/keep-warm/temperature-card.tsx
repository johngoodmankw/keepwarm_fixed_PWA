"use client"

import { useEffect } from "react"
import { Thermometer, ChevronUp, ChevronDown, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface TemperatureCardProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  temperature: number
  onTemperatureChange: (temp: number) => void
  dishName: string
}

// Check if dish is poultry-related (165°F)
function isPoultryDish(name: string): boolean {
  const poultryKeywords = ["chicken", "turkey", "duck", "poultry", "eggs", "egg", "hen", "fowl"]
  const lowerName = name.toLowerCase()
  return poultryKeywords.some(keyword => lowerName.includes(keyword))
}

// Check if dish is fish-related (145°F)
function isFishDish(name: string): boolean {
  const fishKeywords = ["fish", "salmon", "tuna", "cod", "tilapia", "halibut", "trout", "bass", "seafood"]
  const lowerName = name.toLowerCase()
  return fishKeywords.some(keyword => lowerName.includes(keyword))
}

export function TemperatureCard({
  enabled,
  onToggle,
  temperature,
  onTemperatureChange,
  dishName,
}: TemperatureCardProps) {
  const increment = () => onTemperatureChange(Math.min(temperature + 5, 200))
  const decrement = () => onTemperatureChange(Math.max(temperature - 5, 100))
  
  const poultryMode = isPoultryDish(dishName)
  const fishMode = isFishDish(dishName)
  const isPoultryTemp = temperature >= 165

  // Auto-set temperature based on dish name when enabled
  useEffect(() => {
    if (enabled && dishName) {
      if (isPoultryDish(dishName)) {
        onTemperatureChange(165)
      } else if (isFishDish(dishName)) {
        onTemperatureChange(145)
      }
    }
  }, [enabled, dishName, onTemperatureChange])

  return (
    <div 
      className={`bg-white rounded-2xl border border-[#E8E4DE] shadow-sm transition-all duration-300 ${
        enabled ? "p-5 pb-6" : "p-5"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C6A66A]/15 flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-[#C6A66A]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Temperature Pairing</h3>
            <p className="text-xs text-[#9B9B9B]">Smart heat control</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>

      {enabled && (
        <div className="mt-6 space-y-4">
          {/* Small Smart Pairing Badge - "intel inside" style */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F2ED] border border-[#E8E4DE]">
              <Zap className="w-2.5 h-2.5 text-[#C6A66A]" />
              <span className="text-[10px] font-medium text-[#6B6B6B]">Smart Pairing</span>
            </div>
          </div>

          {/* Large Digital Temperature Readout with Neomorphic Controls */}
          <div className="flex items-center justify-center gap-6">
            {/* Neomorphic Down Button */}
            <button
              onClick={decrement}
              className="w-14 h-14 rounded-full flex items-center justify-center text-[#1C1C1C] transition-all active:scale-95"
              style={{
                background: "linear-gradient(145deg, #ffffff, #e6e2dc)",
                boxShadow: "6px 6px 12px #d5d1cc, -6px -6px 12px #ffffff"
              }}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            
            <div className="flex items-baseline gap-1">
              <span 
                className="text-6xl font-bold tracking-tighter text-[#1C1C1C]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {temperature}
              </span>
              <span className="text-2xl font-medium text-[#6B6B6B]">°F</span>
            </div>
            
            {/* Neomorphic Up Button */}
            <button
              onClick={increment}
              className="w-14 h-14 rounded-full flex items-center justify-center text-[#1C1C1C] transition-all active:scale-95"
              style={{
                background: "linear-gradient(145deg, #ffffff, #e6e2dc)",
                boxShadow: "6px 6px 12px #d5d1cc, -6px -6px 12px #ffffff"
              }}
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          </div>

          {/* Single merged FDA Safety Badge (when poultry detected and at safe temp) */}
          {poultryMode && isPoultryTemp && (
            <div className="flex justify-center">
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C6A66A]/15 border border-[#C6A66A]/30"
              >
                <span className="text-xs font-medium text-[#C6A66A]">
                  FDA Poultry Safety Standard
                </span>
              </div>
            </div>
          )}

          {/* Fish temperature indicator */}
          {fishMode && temperature === 145 && (
            <div className="flex justify-center">
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6B9DC6]/15 border border-[#6B9DC6]/30"
              >
                <span className="text-xs font-medium text-[#6B9DC6]">
                  Fish Safe Temperature
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
