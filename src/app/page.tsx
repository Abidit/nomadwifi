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
    setIsAddingMode(false)
    setPendingLat(null)
    setPendingLng(null)
  }

  const handleSpotAdded = useCallback(() => {
    fetchSpots()
    setIsFormOpen(false)
    setIsAddingMode(false)
  }, [fetchSpots])

  return (
    <>
      {/* Full-screen map — fixed, never affected by sibling layout */}
      <div className="fixed left-0 right-0 bottom-0 top-16 z-0">
        <Map
          spots={filteredSpots}
          onMapClick={handleMapClick}
          onSpotClick={handleSpotClick}
          isAddingMode={isAddingMode}
        />
      </div>

      {/* Filter bar */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000]">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Spot count */}
      <div className="fixed top-20 left-4 z-[1000] bg-white rounded-full shadow-md px-4 py-2 text-sm font-medium text-[#222222] border border-[#ebebeb]">
        {filteredSpots.length} spots found
      </div>

      {/* Selected spot card */}
      {selectedSpot && (
        <div className="fixed bottom-8 left-4 z-[1000]">
          <SpotCard spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
        </div>
      )}

      {/* Adding mode banner */}
      {isAddingMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] mt-14">
          <div className="bg-[#00A699] text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg flex items-center gap-2">
            📍 Click anywhere on the map to place your spot
            <button
              onClick={() => setIsAddingMode(false)}
              className="ml-2 underline text-white/80 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-[1000]">
        <button
          onClick={handleAddSpot}
          className="bg-[#00A699] hover:bg-[#008F84] text-white rounded-full shadow-lg px-6 py-3 flex items-center gap-2 font-medium transition-all text-sm"
        >
          <Plus size={16} /> Add a spot
        </button>
      </div>

      {/* Backdrop */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[1999]"
          onClick={handleFormClose}
        />
      )}

      {/* Form — always last, always fixed */}
      <AddSpotForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        lat={pendingLat}
        lng={pendingLng}
        onSpotAdded={handleSpotAdded}
      />
    </>
  )
}
