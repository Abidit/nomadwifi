'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { WifiSpeed, NoiseLevel, PowerOutlets } from '@/types/spot'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddSpotFormProps {
  lat: number | null
  lng: number | null
  onSpotAdded: () => void
}

export default function AddSpotForm({ lat, lng, onSpotAdded }: AddSpotFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [wifiSpeed, setWifiSpeed] = useState<WifiSpeed>('medium')
  const [powerBackup, setPowerBackup] = useState(false)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [noiseLevel, setNoiseLevel] = useState<NoiseLevel | ''>('')
  const [powerOutlets, setPowerOutlets] = useState<PowerOutlets | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

  const blocklist = ['test', 'fake', 'lol', 'asdf', 'aoka', 'lorem',
    'xxx', '123', 'null', 'undefined', 'string', 'sample', 'demo', 'paficic', 'altantic']

  const validate = (): string[] => {
    const errors: string[] = []
    const trimmedName = name?.trim() || ''

    if (trimmedName.length < 3)
      errors.push('Name must be at least 3 characters')

    if (trimmedName.length > 60)
      errors.push('Name is too long (max 60 characters)')

    if (trimmedName.length > 0 && /^[^a-zA-Z0-9]+$/.test(trimmedName))
      errors.push('Name must contain real words')

    if (blocklist.some(w => trimmedName.toLowerCase().includes(w)))
      errors.push('Please enter a real place name')

    if (!description.trim())
      errors.push('Description is required')

    if (!wifiSpeed)
      errors.push('Please select a wifi speed')

    if (!lat || !lng)
      errors.push('Please click the map to place your spot')

    return errors
  }

  const reset = () => {
    setName('')
    setDescription('')
    setWifiSpeed('medium')
    setPowerBackup(false)
    setCity('')
    setCountry('')
    setNoiseLevel('')
    setPowerOutlets('')
    setFormErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (errors.length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors([])
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
        noise_level: noiseLevel || null,
        power_outlets: powerOutlets || null,
      })
      reset()
      onSpotAdded()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-t-4 border-[#00A699] -mx-4 mb-4" />

      {lat !== null && lng !== null ? (
        <div className="bg-teal-50 rounded-lg p-3 text-sm text-teal-700">
          📍 Pin placed at {lat.toFixed(5)}, {lng.toFixed(5)}
        </div>
      ) : (
        <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-700">
          📍 Click anywhere on the map to place your spot
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="spot-name" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="spot-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Himalayan Java Coffee"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="spot-description" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Description <span className="text-red-400">*</span>
        </Label>
        <Input
          id="spot-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any tips for nomads?"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Wifi Speed <span className="text-red-400">*</span>
        </Label>
        <select
          value={wifiSpeed}
          onChange={(e) => setWifiSpeed(e.target.value as WifiSpeed)}
          className="w-full h-10 px-3 rounded-lg border border-[#ebebeb] bg-white text-[#222222] text-sm focus:outline-none focus:ring-2 focus:ring-[#00A699] cursor-pointer"
        >
          <option value="slow">🔴 Slow</option>
          <option value="medium">🟡 Medium</option>
          <option value="fast">🟢 Fast</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Noise Level</Label>
        <select
          value={noiseLevel}
          onChange={(e) => setNoiseLevel(e.target.value as NoiseLevel | '')}
          className="w-full h-10 px-3 rounded-lg border border-[#ebebeb] bg-white text-[#222222] text-sm focus:outline-none focus:ring-2 focus:ring-[#00A699] cursor-pointer"
        >
          <option value="">Select noise level</option>
          <option value="quiet">🤫 Quiet</option>
          <option value="moderate">💬 Moderate</option>
          <option value="loud">🔊 Loud</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Power Outlets</Label>
        <select
          value={powerOutlets}
          onChange={(e) => setPowerOutlets(e.target.value as PowerOutlets | '')}
          className="w-full h-10 px-3 rounded-lg border border-[#ebebeb] bg-white text-[#222222] text-sm focus:outline-none focus:ring-2 focus:ring-[#00A699] cursor-pointer"
        >
          <option value="">Select outlet availability</option>
          <option value="none">🔋 None</option>
          <option value="limited">⚡ Limited</option>
          <option value="plenty">🔌 Plenty</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Power Backup</Label>
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
        <Label htmlFor="spot-city" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>City</Label>
        <Input
          id="spot-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Kathmandu"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="spot-country" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Country</Label>
        <Input
          id="spot-country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Nepal"
        />
      </div>

      {formErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
          {formErrors.map((err, i) => (
            <p key={i} className="text-red-500 text-sm">• {err}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#00A699] hover:bg-[#008F84] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl h-11 font-medium flex items-center justify-center gap-2 transition-colors"
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
  )
}
