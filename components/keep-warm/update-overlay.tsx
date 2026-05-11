"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

interface UpdateOverlayProps {
  isVisible: boolean
  onComplete: () => void
  duration?: number
}

function DitheredTransition({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23FFFF00' opacity='0.8'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23FFFF00' opacity='0.8'/%3E%3Crect x='1' y='3' width='1' height='1' fill='%23FF0000' opacity='0.6'/%3E%3Crect x='3' y='1' width='1' height='1' fill='%23FF0000' opacity='0.6'/%3E%3C/svg%3E")`,
          backgroundSize: '8px 8px',
          opacity: progress < 100 ? 0.15 + (Math.sin(progress * 0.1) * 0.05) : 0,
          transform: `translateY(${(1 - progress / 100) * 100}%)`
        }}
      />
    </div>
  )
}

export function UpdateOverlay({ isVisible, onComplete, duration = 3000 }: UpdateOverlayProps) {
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(Math.ceil(duration / 1000))

  useEffect(() => {
    if (!isVisible) {
      setProgress(0)
      setShowSuccess(false)
      setRemainingSeconds(Math.ceil(duration / 1000))
      return
    }

    const startTime = Date.now()
    // 100ms interval — imperceptible vs 50ms but half the setState calls
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)
      setRemainingSeconds(Math.max(0, Math.ceil((duration - elapsed) / 1000)))

      if (newProgress >= 100) {
        clearInterval(interval)
        setShowSuccess(true)
        setTimeout(onComplete, 1200)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isVisible, duration, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-[#1C1C1C] flex flex-col items-center justify-center p-8">
      <DitheredTransition progress={progress} />

      {showSuccess ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 rounded-full bg-[#FFFF00] flex items-center justify-center mb-6 shadow-lg">
            <Check className="w-12 h-12 text-[#1C1C1C]" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Display Updated</h2>
          <p className="text-sm text-[#FFFF00] mt-2">Spectra 3100 cycle complete</p>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#FFFF00]/20 via-[#FF0000]/10 to-transparent"
                style={{ transform: `translateY(${100 - progress}%)`, transition: 'transform 100ms linear' }}
              />
              <span className="text-3xl font-bold text-white tabular-nums relative z-10">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className="relative w-full h-3 rounded-full bg-white/10 overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FFFF00 0%, #FF0000 100%)' }}
            />
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-white mb-1">
              Initiating Spectra 3100 Pigment Cycle...
            </h2>
            <p className="text-sm text-[#FFFF00] font-medium tabular-nums">{remainingSeconds}s remaining</p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/40">
            <span>Unit #402</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>E-Paper Refresh</span>
          </div>
        </div>
      )}
    </div>
  )
}
