import { MapPin, X } from 'lucide-react'
import type { Spot } from '@/types/spot'

interface SpotCardProps {
  spot: Spot
  onClose: () => void
}

function getRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

const SPEED_CONFIG = {
  slow: { label: 'Slow wifi', className: 'bg-red-50 text-red-500' },
  medium: { label: 'Medium wifi', className: 'bg-amber-50 text-amber-500' },
  fast: { label: 'Fast wifi', className: 'bg-teal-50 text-teal-600' },
}

export default function SpotCard({ spot, onClose }: SpotCardProps) {
  const speed = SPEED_CONFIG[spot.wifi_speed]
  const location = [spot.city, spot.country].filter(Boolean).join(', ')

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 w-72 border border-[#ebebeb]">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-semibold text-[#222222] leading-tight pr-2">{spot.name}</h3>
        <button
          onClick={onClose}
          className="text-[#717171] hover:text-[#222222] transition-colors flex-shrink-0 -mt-0.5"
        >
          <X size={18} />
        </button>
      </div>

      {location && (
        <div className="flex items-center gap-1 text-sm text-[#717171] mb-3">
          <MapPin size={13} className="flex-shrink-0" />
          <span>{location}</span>
        </div>
      )}

      <div className="h-px bg-[#ebebeb] mb-3" />

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${speed.className}`}>
          {speed.label}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            spot.power_backup ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400'
          }`}
        >
          {spot.power_backup ? '⚡ Power backup' : 'No backup'}
        </span>
      </div>

      {spot.description && (
        <p className="text-sm text-[#717171] mt-2">{spot.description}</p>
      )}

      <p className="text-xs text-[#717171] mt-3">Added {getRelativeTime(spot.created_at)}</p>
    </div>
  )
}
