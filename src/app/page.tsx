'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Plus, Menu } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Spot, WifiSpeed, NoiseLevel } from '@/types/spot'
import Sidebar from '@/components/Sidebar'
import RightPanel from '@/components/RightPanel'
import CommandPalette from '@/components/CommandPalette'
import type { MapHandle } from '@/components/Map'
import { geocodeCity } from '@/lib/geocode'

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse" style={{ background: 'var(--bg)' }} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any

export default function HomePage() {
  const mapRef = useRef<MapHandle>(null)

  // Data
  const [spots, setSpots] = useState<Spot[]>([])

  // Filters
  const [speedFilter, setSpeedFilter] = useState<WifiSpeed | 'all'>('all')
  const [noiseFilter, setNoiseFilter] = useState<NoiseLevel | 'all'>('all')
  const [powerFilter, setPowerFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Panel state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState<'detail' | 'add'>('detail')
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [pendingLat, setPendingLat] = useState<number | null>(null)
  const [pendingLng, setPendingLng] = useState<number | null>(null)

  // UI
  const [isMobile, setIsMobile] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)

  // isAddingMode: user is in "place pin" mode
  const isAddingMode = rightPanelOpen && rightPanelTab === 'add' && pendingLat === null

  // Detect mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Geolocation
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus('success')
      },
      () => setLocationStatus('error')
    )
  }, [])

  // Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Invalidate Leaflet size after sidebar/panel transitions
  useEffect(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 250)
    return () => clearTimeout(timer)
  }, [sidebarOpen, rightPanelOpen])

  // Auto-pan on search query
  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) return
    const timer = setTimeout(async () => {
      const result = await geocodeCity(q)
      if (result) mapRef.current?.flyTo(result.lat, result.lng, 12)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchSpots = useCallback(async () => {
    const { data, error } = await supabase
      .from('spots')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('Supabase error:', error)
    if (data) setSpots(data as Spot[])
  }, [])

  useEffect(() => { fetchSpots() }, [fetchSpots])

  const filteredSpots = spots.filter((spot) => {
    if (speedFilter !== 'all' && spot.wifi_speed !== speedFilter) return false
    if (powerFilter && !spot.power_backup) return false
    if (noiseFilter !== 'all' && spot.noise_level !== noiseFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesName = spot.name.toLowerCase().includes(q)
      const matchesCity = spot.city?.toLowerCase().includes(q)
      const matchesCountry = spot.country?.toLowerCase().includes(q)
      if (!matchesName && !matchesCity && !matchesCountry) return false
    }
    return true
  })

  const handleFilterChange = useCallback(
    (speed: WifiSpeed | 'all', power: boolean, noise: NoiseLevel | 'all') => {
      setSpeedFilter(speed)
      setPowerFilter(power)
      setNoiseFilter(noise)
    },
    []
  )

  const handleSpotSelect = useCallback((spot: Spot) => {
    setSelectedSpot(spot)
    setRightPanelTab('detail')
    setRightPanelOpen(true)
    mapRef.current?.flyTo(spot.lat, spot.lng, 14)
  }, [])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPendingLat(lat)
    setPendingLng(lng)
  }, [])

  const handleAddSpot = useCallback(() => {
    setPendingLat(null)
    setPendingLng(null)
    setRightPanelTab('add')
    setRightPanelOpen(true)
  }, [])

  const handleRightPanelClose = useCallback(() => {
    setRightPanelOpen(false)
    setPendingLat(null)
    setPendingLng(null)
  }, [])

  const handleTabChange = useCallback((tab: 'detail' | 'add') => {
    setRightPanelTab(tab)
    if (tab === 'add') {
      // Clear pin so user places a fresh one
      setPendingLat(null)
      setPendingLng(null)
    }
  }, [])

  const handleSpotAdded = useCallback(() => {
    fetchSpots()
    setRightPanelOpen(false)
    setPendingLat(null)
    setPendingLng(null)
  }, [fetchSpots])

  const handleUpvote = useCallback((spotId: string) => {
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, upvotes: s.upvotes + 1 } : s))
    )
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        spots={filteredSpots}
        userLocation={userLocation}
        locationStatus={locationStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        speedFilter={speedFilter}
        noiseFilter={noiseFilter}
        powerFilter={powerFilter}
        onFilterChange={handleFilterChange}
        onSpotSelect={handleSpotSelect}
        selectedSpotId={selectedSpot?.id ?? null}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
        onTransitionEnd={() => mapRef.current?.invalidateSize()}
      />

      {/* Map area */}
      <div className="flex-1 relative h-full min-w-0">
        <Map
          ref={mapRef}
          spots={filteredSpots}
          onMapClick={handleMapClick}
          onSpotClick={handleSpotSelect}
          isAddingMode={isAddingMode}
        />

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-3 left-3 z-[500] rounded-xl shadow-md p-2.5 border"
            style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border)' }}
            aria-label="Open menu"
          >
            <Menu size={19} style={{ color: 'var(--text-primary)' }} />
          </button>
        )}

        {/* Adding mode banner */}
        {isAddingMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
            <div className="bg-[#00A699] text-white rounded-full px-5 py-2 text-sm font-medium shadow-lg">
              📍 Click anywhere on the map to place your spot
            </div>
          </div>
        )}

        {/* FAB — hidden whenever right panel is open */}
        {!rightPanelOpen && (
          <button
            onClick={handleAddSpot}
            className="absolute bottom-8 right-6 z-[500] bg-[#00A699] hover:bg-[#008F84] text-white rounded-full shadow-lg px-5 py-3 flex items-center gap-2 font-medium transition-all text-sm"
          >
            <Plus size={16} /> Add a spot
          </button>
        )}

        {/* Ctrl+K hint — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCmdOpen(true)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500] rounded-full shadow-md px-4 py-2 text-xs border flex items-center gap-2 backdrop-blur-sm transition-colors hover:bg-[var(--bg)]"
            style={{
              background: 'rgba(255,255,255,0.85)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <kbd className="font-mono">⌘K</kbd> Quick search
          </button>
        )}
      </div>

      {/* Right Panel */}
      <RightPanel
        isOpen={rightPanelOpen}
        activeTab={rightPanelTab}
        onTabChange={handleTabChange}
        onClose={handleRightPanelClose}
        selectedSpot={selectedSpot}
        onUpvote={handleUpvote}
        lat={pendingLat}
        lng={pendingLng}
        onSpotAdded={handleSpotAdded}
        isMobile={isMobile}
        onTransitionEnd={() => mapRef.current?.invalidateSize()}
      />

      {/* Command Palette */}
      <CommandPalette
        spots={spots}
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSpotSelect={(spot) => {
          handleSpotSelect(spot)
          setCmdOpen(false)
        }}
      />
    </div>
  )
}
