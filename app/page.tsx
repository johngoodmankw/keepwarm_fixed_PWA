"use client"

import { useState, useCallback, useEffect } from "react"
import { ChevronLeft, QrCode, Battery, Wifi } from "lucide-react"
import { PreviewCard } from "@/components/keep-warm/preview-card"
import { DishInput } from "@/components/keep-warm/dish-input"
import { IconSelector } from "@/components/keep-warm/icon-selector"
import { TemperatureCard } from "@/components/keep-warm/temperature-card"
import { UpdateOverlay } from "@/components/keep-warm/update-overlay"
import { FoodSketchBrowser } from "@/components/keep-warm/food-sketch-browser"
import { ZoneAUploader } from "@/components/keep-warm/zone-a-uploader"
import { useFoodSketches } from "@/hooks/use-food-sketches"
import { toast } from "sonner"
import type { MenuItem } from "@/lib/keep-warm/menu-library"
import menuMapping from "@/lib/menu-mapping.json"

export default function KeepWarmPage() {
  // Dish Selection State
  const [dishName, setDishName] = useState("")
  const [description, setDescription] = useState("")
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Food Sketch State
  const [selectedSketch, setSelectedSketch] = useState<string | null>(null)
  const { getSketchSvg } = useFoodSketches()

  // Temperature Pairing State
  const [tempEnabled, setTempEnabled] = useState(false)
  const [temperature, setTemperature] = useState(145)
  const [targetTemp, setTargetTemp] = useState<string | null>(null)

  // Zone A Asset State
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  // Icon Selection State
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])

  // Update/Refresh State
  const [isUpdating, setIsUpdating] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(3)

  const handleMenuItemSelect = (item: MenuItem | null) => {
    if (item) {
      setDescription(item.description)
      setSelectedAllergens(item.allergens)
      setSelectedDietary(item.dietary)
      setTargetTemp(item.targetTemp || null)
      const file = (menuMapping as Record<string, string>)[item.name] ?? null
      setSelectedSketch(file)
    } else {
      setDescription("")
      setSelectedAllergens([])
      setSelectedDietary([])
      setSelectedSketch(null)
      setTargetTemp(null)
    }
  }

  const handleSaveToLibrary = () => {
    toast.success(`"${dishName}" saved to library!`)
  }

  // Progress bar animation - 3 second hardware refresh simulation
  useEffect(() => {
    if (!buttonLoading) {
      setLoadingProgress(0)
      setRemainingSeconds(3)
      return
    }

    const totalDuration = 3000
    const interval = 100
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += interval
      const progress = Math.min((elapsed / totalDuration) * 100, 100)
      setLoadingProgress(progress)
      setRemainingSeconds(Math.max(0, Math.ceil((totalDuration - elapsed) / 1000)))

      if (elapsed >= totalDuration) {
        clearInterval(timer)
        setButtonLoading(false)
        setIsUpdating(true)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [buttonLoading])

  const handleUpdate = () => {
    setButtonLoading(true)
  }

  const handleUpdateComplete = useCallback(() => {
    setIsUpdating(false)
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      {/* Update Overlay - Success confirmation */}
      <UpdateOverlay
        isVisible={isUpdating}
        onComplete={handleUpdateComplete}
        duration={3000}
      />

      {/* Header with Unit Status */}
      <header className="sticky top-0 z-50 bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#E8E4DE]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#E8E4DE] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1C1C1C]" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-[#1C1C1C]">Edit Display</h1>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#CD7F32] animate-pulse" />
                <Wifi className="w-3 h-3 text-[#CD7F32]" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#CD7F32]">Unit #402</span>
              <div className="flex items-center gap-0.5">
                <Battery className="w-3.5 h-3.5 text-[#6B6B6B]" />
                <span className="text-[10px] text-[#6B6B6B]">87%</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D5D5D5] hover:border-[#CD7F32] transition-colors">
            <QrCode className="w-4 h-4 text-[#1C1C1C]" />
            <span className="text-xs font-medium text-[#1C1C1C]">Scan unit QR</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-6 pb-36">
        <div className="max-w-lg mx-auto space-y-8">

          {/* E-Paper Preview Card */}
          <section>
            <PreviewCard
              dishName={dishName}
              description={description}
              allergens={selectedAllergens}
              dietary={selectedDietary}
              logoUrl={logoUrl}
              sketchSvg={getSketchSvg(selectedSketch)}
              targetTemp={tempEnabled ? `${temperature}°F` : targetTemp}
            />
          </section>

          {/* Dish Name */}
          <section className="space-y-4">
            <DishInput
              value={dishName}
              onChange={setDishName}
              onMenuItemSelect={handleMenuItemSelect}
              isCustomMode={isCustomMode}
              onCustomModeChange={setIsCustomMode}
              onSaveToLibrary={handleSaveToLibrary}
            />
          </section>

          {/* Description Field */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-[#1C1C1C]">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your dish..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D5D5D5] text-[#1C1C1C] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#CD7F32] focus:ring-1 focus:ring-[#CD7F32] transition-all resize-none"
            />
          </section>

          {/* Allergens & Dietary Icon Selection */}
          <section className="space-y-4">
            <IconSelector
              selectedAllergens={selectedAllergens}
              selectedDietary={selectedDietary}
              onAllergensChange={setSelectedAllergens}
              onDietaryChange={setSelectedDietary}
            />
          </section>

          {/* Food Sketch Browser */}
          <section className="space-y-4">
            <FoodSketchBrowser
              dishName={dishName}
              selectedSketch={selectedSketch}
              onSketchSelect={setSelectedSketch}
            />
          </section>

          {/* Temperature Pairing */}
          <section className="space-y-4">
            <TemperatureCard
              enabled={tempEnabled}
              onToggle={setTempEnabled}
              temperature={temperature}
              onTemperatureChange={setTemperature}
              dishName={dishName}
            />
          </section>

          {/* Zone A Asset Manager (Branding) */}
          <section className="space-y-4">
            <ZoneAUploader
              logoUrl={logoUrl}
              onLogoChange={setLogoUrl}
            />
          </section>
        </div>
      </main>

      {/* Fixed Action Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#F5F2ED]/95 backdrop-blur-md border-t border-[#E8E4DE]">
        <div className="max-w-lg mx-auto px-4 py-4">
          {buttonLoading ? (
            <div className="space-y-3">
              <div className="relative w-full h-14 rounded-2xl bg-[#1C1C1C] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-100 ease-linear"
                  style={{
                    width: `${loadingProgress}%`,
                    background: `linear-gradient(90deg, ${remainingSeconds > 1 ? '#CD7F32' : '#FFD700'} 0%, #FFD700 100%)`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#F5F2ED] font-semibold text-sm">
                    Initiating Spectra 3100 Pigment Cycle... {remainingSeconds}s remaining
                  </span>
                </div>
              </div>
              <p className="text-center text-xs text-[#9B9B9B]">
                Hardware refresh: BWRY E-Paper Cycle
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full h-14 rounded-2xl bg-[#1C1C1C] text-[#F5F2ED] font-semibold text-base flex items-center justify-center gap-2 transition-all duration-150 hover:bg-[#2A2A2A] active:scale-[0.97] active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Update Display
              </button>
              <p className="text-center text-xs text-[#9B9B9B] mt-3">
                Hardware refresh: 3s (Spectra 3100 Cycle)
              </p>
            </>
          )}
        </div>
      </footer>
    </div>
  )
}
