'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { WifiSpeed } from '@/types/spot'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddSpotFormProps {
  isOpen: boolean
  onClose: () => void
  lat: number | null
  lng: number | null
  onSpotAdded: () => void
}

export default function AddSpotForm({ isOpen, onClose, lat, lng, onSpotAdded }: AddSpotFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [wifiSpeed, setWifiSpeed] = useState<WifiSpeed>('medium')
  const [powerBackup, setPowerBackup] = useState(false)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const reset = () => {
    setName('')
    setDescription('')
    setWifiSpeed('medium')
    setPowerBackup(false)
    setCity('')
    setCountry('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || lat === null || lng === null) return
    setIsLoading(true)
    try {
      await supabase.from('spots').insert({
        name,
        description: description || null,
        lat,
        lng,
        wifi_speed: wifiSpeed,
        power_backup: powerBackup,
        city: city || null,
        country: country || null,
      })
      reset()
      onSpotAdded()
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <SheetContent
        side="right"
        className="fixed right-0 top-0 h-full w-full max-w-md z-[2000] shadow-2xl overflow-y-auto p-0"
        style={{ position: 'fixed' }}
        showCloseButton={false}
      >
        <div className="border-t-4 border-[#00A699]" />
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-xl font-semibold text-[#222222]">Add a wifi spot</SheetTitle>
          <SheetDescription className="text-sm text-[#717171]">
            Help the community find great workspaces
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 mt-2">
          {lat !== null && lng !== null && (
            <div className="bg-teal-50 rounded-lg p-3 text-sm text-teal-700">
              📍 Pin placed at {lat.toFixed(5)}, {lng.toFixed(5)}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="spot-name" className="text-sm font-medium text-[#222222]">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="spot-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Himalayan Java Coffee"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="spot-description" className="text-sm font-medium text-[#222222]">
              Description
            </Label>
            <Input
              id="spot-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any tips for nomads?"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#222222]">
              Wifi Speed <span className="text-red-400">*</span>
            </Label>
            <Select value={wifiSpeed} onValueChange={(v) => setWifiSpeed(v as WifiSpeed)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A5F] inline-block" />
                    Slow
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFB400] inline-block" />
                    Medium
                  </span>
                </SelectItem>
                <SelectItem value="fast">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00A699] inline-block" />
                    Fast
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#222222]">Power Backup</Label>
            <button
              type="button"
              onClick={() => setPowerBackup(!powerBackup)}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                powerBackup
                  ? 'border-[#00A699] bg-teal-50 text-teal-700'
                  : 'border-[#ebebeb] bg-white text-[#717171] hover:bg-[#f7f7f7]'
              }`}
            >
              <span>Has power outlets or backup</span>
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  powerBackup ? 'border-[#00A699] bg-[#00A699]' : 'border-[#d4d4d4]'
                }`}
              >
                {powerBackup && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="spot-city" className="text-sm font-medium text-[#222222]">City</Label>
            <Input
              id="spot-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Kathmandu"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="spot-country" className="text-sm font-medium text-[#222222]">Country</Label>
            <Input
              id="spot-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Nepal"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !name || lat === null}
            className="w-full bg-[#00A699] hover:bg-[#008F84] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl h-11 font-medium flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving spot...
              </>
            ) : (
              'Save spot'
            )}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
