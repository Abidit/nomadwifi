'use client'

import { useState, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Spot } from '@/types/spot'

interface SpotCardProps {
  spot: Spot
  onClose?: () => void
  onUpvote: (spotId: string) => void
  embedded?: boolean
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

const NOISE_CONFIG = {
  quiet: { label: '🤫 Quiet', className: 'bg-teal-50 text-teal-600' },
  moderate: { label: '💬 Moderate', className: 'bg-amber-50 text-amber-500' },
  loud: { label: '🔊 Loud', className: 'bg-red-50 text-red-500' },
}

const OUTLETS_CONFIG = {
  none: { label: '🔋 No outlets', className: 'bg-gray-50 text-gray-400' },
  limited: { label: '⚡ Limited outlets', className: 'bg-amber-50 text-amber-500' },
  plenty: { label: '🔌 Plenty of outlets', className: 'bg-teal-50 text-teal-600' },
}

export default function SpotCard({ spot, onClose, onUpvote, embedded }: SpotCardProps) {
  const speed = SPEED_CONFIG[spot.wifi_speed]
  const location = [spot.city, spot.country].filter(Boolean).join(', ')
  const [hasVoted, setHasVoted] = useState(false)
  const [localUpvotes, setLocalUpvotes] = useState(spot.upvotes || 0)

  useEffect(() => {
    setHasVoted(localStorage.getItem(`voted_${spot.id}`) === 'true')
  }, [spot.id])

  useEffect(() => {
    setLocalUpvotes(spot.upvotes || 0)
  }, [spot.upvotes])

  const handleUpvote = async () => {
    if (hasVoted) return

    // Optimistic update
    setHasVoted(true)
    setLocalUpvotes((prev) => prev + 1)
    localStorage.setItem(`voted_${spot.id}`, 'true')

    const { error } = await supabase.rpc('increment_upvotes', { spot_id: spot.id })

    if (error) {
      console.error('Upvote RPC error:', error)
      // Rollback
      setHasVoted(false)
      setLocalUpvotes((prev) => prev - 1)
      localStorage.removeItem(`voted_${spot.id}`)
    } else {
      onUpvote?.(spot.id)
    }
  }

  return (
    <div className={embedded ? 'w-full' : 'bg-white rounded-xl shadow-lg p-5 w-72 border border-[#ebebeb]'}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-semibold text-[#222222] leading-tight pr-2">{spot.name}</h3>
        {!embedded && onClose && (
          <button
            onClick={onClose}
            className="text-[#717171] hover:text-[#222222] transition-colors flex-shrink-0 -mt-0.5"
          >
            <X size={18} />
          </button>
        )}
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
        {spot.noise_level && (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${NOISE_CONFIG[spot.noise_level].className}`}>
            {NOISE_CONFIG[spot.noise_level].label}
          </span>
        )}
        {spot.power_outlets && (
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${OUTLETS_CONFIG[spot.power_outlets].className}`}>
            {OUTLETS_CONFIG[spot.power_outlets].label}
          </span>
        )}
      </div>

      {spot.description && (
        <p className="text-sm text-[#717171] mt-2">{spot.description}</p>
      )}

      <p className="text-xs text-[#717171] mt-3">Added {getRelativeTime(spot.created_at)}</p>

      <div className="h-px bg-[#ebebeb] mt-3 mb-3" />

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#717171]">👍 Helpful?</span>
        <button
          onClick={handleUpvote}
          disabled={hasVoted}
          className={`rounded-full px-3 py-1 text-sm flex items-center gap-1 transition-all ${
            hasVoted
              ? 'border border-[#00A699] bg-teal-50 text-[#00A699]'
              : 'border border-[#ebebeb] text-[#717171] hover:border-[#00A699] hover:text-[#00A699]'
          }`}
        >
          👍 {localUpvotes}
        </button>
      </div>
    </div>
  )
}
