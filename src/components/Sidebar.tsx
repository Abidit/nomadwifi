'use client'

import { Search, X, ChevronLeft, ChevronRight, Wifi } from 'lucide-react'
import type { Spot, WifiSpeed, NoiseLevel } from '@/types/spot'

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const SPEED_BADGE: Record<string, string> = {
  slow: 'bg-red-50 text-red-500',
  medium: 'bg-amber-50 text-amber-500',
  fast: 'bg-teal-50 text-teal-600',
}

interface SidebarProps {
  spots: Spot[]
  userLocation: { lat: number; lng: number } | null
  locationStatus: 'loading' | 'success' | 'error'
  searchQuery: string
  onSearchChange: (q: string) => void
  speedFilter: WifiSpeed | 'all'
  noiseFilter: NoiseLevel | 'all'
  powerFilter: boolean
  onFilterChange: (speed: WifiSpeed | 'all', power: boolean, noise: NoiseLevel | 'all') => void
  onSpotSelect: (spot: Spot) => void
  selectedSpotId: string | null
  isOpen: boolean
  onToggle: () => void
  isMobile: boolean
  onClose: () => void
  onTransitionEnd?: () => void
}

export default function Sidebar({
  spots,
  userLocation,
  locationStatus,
  searchQuery,
  onSearchChange,
  speedFilter,
  noiseFilter,
  powerFilter,
  onFilterChange,
  onSpotSelect,
  selectedSpotId,
  isOpen,
  onToggle,
  isMobile,
  onClose,
  onTransitionEnd,
}: SidebarProps) {
  const sortedSpots = [...spots].sort((a, b) => {
    if (userLocation) {
      return (
        haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        haversineKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
      )
    }
    return (b.upvotes || 0) - (a.upvotes || 0)
  })

  const pill = (active: boolean) =>
    `px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
      active
        ? 'bg-[#222222] text-white border-[#222222]'
        : 'border-[var(--border)] hover:border-[var(--text-secondary)]'
    }`

  const pillStyle = (active: boolean): React.CSSProperties =>
    active ? {} : { color: 'var(--text-secondary)' }

  const content = (
    <div className="flex flex-col h-full" style={{ background: 'var(--sidebar-bg)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between h-14 px-3 flex-shrink-0 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <Wifi size={18} className="text-[#00A699]" />
          <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            NomadWifi
          </span>
        </div>
        <button
          onClick={isMobile ? onClose : onToggle}
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={isMobile ? 'Close menu' : 'Collapse sidebar'}
        >
          {isMobile ? <X size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 border"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          <Search size={14} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search spots, cities..."
            className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
            style={{ color: 'var(--text-primary)' }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        className="px-3 pb-3 flex-shrink-0 border-b space-y-2.5"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Wifi Speed
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'slow', 'medium', 'fast'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onFilterChange(s, powerFilter, noiseFilter)}
                className={pill(speedFilter === s)}
                style={pillStyle(speedFilter === s)}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Noise Level
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'quiet', 'moderate', 'loud'] as const).map((n) => (
              <button
                key={n}
                onClick={() => onFilterChange(speedFilter, powerFilter, n)}
                className={pill(noiseFilter === n)}
                style={pillStyle(noiseFilter === n)}
              >
                {n === 'all' ? 'All' : n.charAt(0).toUpperCase() + n.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            Power
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onFilterChange(speedFilter, false, noiseFilter)}
              className={pill(!powerFilter)}
              style={pillStyle(!powerFilter)}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange(speedFilter, true, noiseFilter)}
              className={pill(powerFilter)}
              style={pillStyle(powerFilter)}
            >
              ⚡ Has backup
            </button>
          </div>
        </div>
      </div>

      {/* Spot count */}
      <div className="px-3 py-2 flex-shrink-0">
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {sortedSpots.length} spot{sortedSpots.length !== 1 ? 's' : ''}
          {locationStatus === 'loading' && ' · Locating you...'}
          {locationStatus === 'success' && ' · 📍 by distance'}
          {locationStatus === 'error' && ' · by popularity'}
        </p>
      </div>

      {/* Spot list */}
      <div className="flex-1 overflow-y-auto">
        {sortedSpots.map((spot) => {
          const dist = userLocation
            ? haversineKm(userLocation.lat, userLocation.lng, spot.lat, spot.lng)
            : null
          const location = [spot.city, spot.country].filter(Boolean).join(', ')
          const isSelected = spot.id === selectedSpotId

          return (
            <button
              key={spot.id}
              onClick={() => {
                onSpotSelect(spot)
                if (isMobile) onClose()
              }}
              className="w-full text-left px-3 py-2.5 border-b transition-colors"
              style={{
                borderColor: 'var(--border)',
                background: isSelected ? 'var(--bg)' : 'transparent',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {spot.name}
                  </p>
                  {location && (
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {location}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${SPEED_BADGE[spot.wifi_speed]}`}
                  >
                    {spot.wifi_speed}
                  </span>
                  {dist !== null && (
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)} km`}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
        {sortedSpots.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
            No spots found
          </p>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/40" onClick={onClose} />
        )}
        <div
          className="fixed top-0 left-0 bottom-0 z-[1001] w-[280px] overflow-hidden transition-transform duration-300"
          style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {content}
        </div>
      </>
    )
  }

  return (
    <div
      className="h-full flex-shrink-0 overflow-hidden transition-[width] duration-200"
      style={{ width: isOpen ? '280px' : '40px', borderRight: '1px solid var(--border)' }}
      onTransitionEnd={onTransitionEnd}
    >
      {isOpen ? (
        content
      ) : (
        <div
          className="h-full flex flex-col items-center pt-3"
          style={{ background: 'var(--sidebar-bg)' }}
        >
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg)]"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Expand sidebar"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  )
}
