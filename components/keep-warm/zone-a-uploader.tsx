"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface ZoneAUploaderProps {
  logoUrl: string | null
  onLogoChange: (url: string | null) => void
}

export function ZoneAUploader({ logoUrl, onLogoChange }: ZoneAUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    // Revoke previous blob URL to free memory
    if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl)
    onLogoChange(URL.createObjectURL(file))
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) processFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleClear = () => {
    if (logoUrl?.startsWith("blob:")) URL.revokeObjectURL(logoUrl)
    onLogoChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Branding</label>

      {logoUrl ? (
        <div className="relative rounded-xl border-2 border-[#CD7F32] bg-white p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-[#FAFAFA] border border-[#E8E4DE] flex items-center justify-center overflow-hidden">
              <img src={logoUrl} alt="Hotel Logo" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1C1C1C]">Logo uploaded</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Will appear centered in Zone A of the e-paper display
              </p>
            </div>
            <button
              onClick={handleClear}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8E4DE] transition-colors"
            >
              <X className="w-4 h-4 text-[#6B6B6B]" />
            </button>
          </div>
          <div className="mt-3 p-2 rounded-lg bg-[#FAFAFA] border border-[#E8E4DE]">
            <p className="text-[10px] text-[#6B6B6B] text-center">
              Note: Logo will be rendered in Black & White for Spectra 3100 e-paper
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
            isDragging
              ? "border-[#CD7F32] bg-[#FFD700]/10"
              : "border-[#D5D5D5] bg-white hover:border-[#CD7F32]"
          }`}
        >
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
              isDragging ? "bg-[#FFD700]" : "bg-[#F5F2ED]"
            }`}>
              {isDragging
                ? <ImageIcon className="w-6 h-6 text-[#1C1C1C]" />
                : <Upload className="w-6 h-6 text-[#6B6B6B]" />
              }
            </div>
            <p className="text-sm font-medium text-[#1C1C1C] mb-1">
              {isDragging ? "Drop image here" : "Upload brand image"}
            </p>
            <p className="text-xs text-[#9B9B9B] text-center">Drag & drop or click to browse</p>
            <p className="text-[10px] text-[#9B9B9B] mt-2">PNG, JPG, SVG (max 2MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm border-2 border-[#1C1C1C]" />
        <span className="text-[10px] text-[#6B6B6B]">
          Optimal size: 200×50px · Transparent PNG recommended
        </span>
      </div>
    </div>
  )
}
