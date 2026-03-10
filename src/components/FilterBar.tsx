'use client'

import { useState } from 'react'
import type { WifiSpeed } from '@/types/spot'

interface FilterBarProps {
  onFilterChange: (speed: WifiSpeed | 'all', powerOnly: boolean) => void
}

const SPEEDS: Array<{ value: WifiSpeed | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'slow', label: 'Slow' },
  { value: 'medium', label: 'Medium' },
  { value: 'fast', label: 'Fast' },
]

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeSpeed, setActiveSpeed] = useState<WifiSpeed | 'all'>('all')
  const [powerOnly, setPowerOnly] = useState(false)

  const handleSpeedChange = (speed: WifiSpeed | 'all') => {
    setActiveSpeed(speed)
    onFilterChange(speed, powerOnly)
  }

  const handlePowerToggle = () => {
    const next = !powerOnly
    setPowerOnly(next)
    onFilterChange(activeSpeed, next)
  }

  return (
    <div className="bg-white rounded-full shadow-md px-2 py-1.5 flex items-center gap-1 border border-[#ebebeb]">
      {SPEEDS.map((s) => (
        <button
          key={s.value}
          onClick={() => handleSpeedChange(s.value)}
          className={
            activeSpeed === s.value
              ? 'bg-[#222222] text-white rounded-full px-4 py-1.5 text-sm font-medium transition-all'
              : 'text-[#717171] hover:bg-[#f7f7f7] rounded-full px-4 py-1.5 text-sm transition-all'
          }
        >
          {s.label}
        </button>
      ))}
      <div className="w-px h-5 bg-[#ebebeb] mx-1" />
      <button
        onClick={handlePowerToggle}
        className={
          powerOnly
            ? 'bg-[#222222] text-white rounded-full px-4 py-1.5 text-sm font-medium transition-all'
            : 'text-[#717171] hover:bg-[#f7f7f7] rounded-full px-4 py-1.5 text-sm transition-all'
        }
      >
        ⚡ Power backup
      </button>
    </div>
  )
}
