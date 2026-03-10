'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Spot, WifiSpeed } from '@/types/spot'
import SpotCard from '@/components/SpotCard'
import FilterBar from '@/components/FilterBar'
import AddSpotForm from '@/components/AddSpotForm'

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#f7f7f7] animate-pulse" />,
})

export default function HomePage() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [isAddingMode, setIsAddingMode] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pendingLat, setPendingLat] = useState<number | null>(null)
  const [pendingLng, setPendingLng] = useState<number | null>(null)
  const [speedFilter, setSpeedFilter] = useState<WifiSpeed | 'all'>('all')
  const [powerFilter, setPowerFilter] = useState(false)

  const fetchSpots = useCallback(async () => {
    const { data, error } = await supabase
      .from('spots')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('Supabase error:', error)
    console.log('spots loaded:', data)
    if (data) setSpots(data as Spot[])
  }, [])

  useEffect(() => {
    fetchSpots()
  }, [fetchSpots])

  const filteredSpots = spots.filter((spot) => {
    if (speedFilter !== 'all' && spot.wifi_speed !== speedFilter) return false
    if (powerFilter && !spot.power_backup) return false
    return true
  })

  const handleFilterChange = useCallback((speed: WifiSpeed | 'all', powerOnly: boolean) => {
    setSpeedFilter(speed)
    setPowerFilter(powerOnly)
  }, [])

  const handleAddSpot = () => {
    setSelectedSpot(null)
    setIsAddingMode(true)
  }

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPendingLat(lat)
    setPendingLng(lng)
    setIsAddingMode(false)
    setIsFormOpen(true)
  }, [])

  const handleSpotClick = useCallback((spot: Spot) => {
    setSelectedSpot(spot)
  }, [])

  const handleFormClose = () => {
    setIsFormOpen(false)
    setPendingLat(null)
    setPendingLng(null)
  }

  return (
    <main className="relative w-full" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Full-screen map */}
      <Map
        spots={filteredSpots}
        onMapClick={handleMapClick}
        onSpotClick={handleSpotClick}
        isAddingMode={isAddingMode}
      />

      {/* Filter bar — fixed top center */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000]">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Spot count — fixed top left */}
      <div className="fixed top-20 left-4 z-[1000] bg-white rounded-full shadow-md px-4 py-2 text-sm font-medium text-[#222222] border border-[#ebebeb]">
        <span className="font-semibold">{filteredSpots.length}</span>
        <span className="text-[#717171] ml-1">spots found</span>
      </div>

      {/* Selected spot card — floating bottom left */}
      {selectedSpot && (
        <div className="fixed bottom-8 left-4 z-[1000]">
          <SpotCard spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
        </div>
      )}

      {/* Add spot FAB — fixed bottom right */}
      <button
        onClick={handleAddSpot}
        className="fixed bottom-8 right-8 z-[1000] bg-[#00A699] hover:bg-[#008F84] text-white rounded-full shadow-lg px-6 py-3 flex items-center gap-2 font-medium transition-all text-sm"
      >
        <Plus size={16} />
        Add a spot
      </button>

      {/* Adding mode instruction banner */}
      {isAddingMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-[#00A699] text-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 text-sm font-medium pointer-events-auto">
            <span>📍 Click anywhere on the map to place your spot</span>
            <button
              onClick={() => setIsAddingMode(false)}
              className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <AddSpotForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        lat={pendingLat}
        lng={pendingLng}
        onSpotAdded={fetchSpots}
      />
    </main>
  )
}
