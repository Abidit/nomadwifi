'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, Marker } from 'leaflet'
import type { Spot } from '@/types/spot'

interface MapProps {
  spots: Spot[]
  onMapClick: (lat: number, lng: number) => void
  onSpotClick: (spot: Spot) => void
  isAddingMode: boolean
}

const SPEED_COLORS: Record<string, string> = {
  slow: '#FF5A5F',
  medium: '#FFB400',
  fast: '#00A699',
}

function markerHtml(speed: string): string {
  const color = SPEED_COLORS[speed] ?? '#00A699'
  return `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:white;border:2.5px solid ${color};border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.18);"><div style="width:12px;height:12px;background:${color};border-radius:50%;"></div></div>`
}

export default function Map({ spots, onMapClick, onSpotClick, isAddingMode }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<Record<string, Marker>>({})
  const tempMarkerRef = useRef<Marker | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  // Keep latest callbacks in refs so event handlers don't go stale
  const onMapClickRef = useRef(onMapClick)
  const onSpotClickRef = useRef(onSpotClick)
  const isAddingModeRef = useRef(isAddingMode)
  useEffect(() => { onMapClickRef.current = onMapClick }, [onMapClick])
  useEffect(() => { onSpotClickRef.current = onSpotClick }, [onSpotClick])
  useEffect(() => { isAddingModeRef.current = isAddingMode }, [isAddingMode])

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let cancelled = false

    const init = async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !containerRef.current) return

      const map = L.map(containerRef.current, { center: [20, 0], zoom: 2 })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)

      map.on('click', async (e) => {
        if (!isAddingModeRef.current) return
        const LL = (await import('leaflet')).default
        const { lat, lng } = e.latlng

        if (tempMarkerRef.current) {
          tempMarkerRef.current.remove()
          tempMarkerRef.current = null
        }

        const icon = LL.divIcon({
          html: markerHtml('fast'),
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
        tempMarkerRef.current = LL.marker([lat, lng], { icon, draggable: true }).addTo(map)
        onMapClickRef.current(lat, lng)
      })

      mapRef.current = map
      setIsMapReady(true)
    }

    init()

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Sync markers whenever spots change or map becomes ready
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return

    const sync = async () => {
      const L = (await import('leaflet')).default
      if (!mapRef.current) return

      Object.values(markersRef.current).forEach((m) => m.remove())
      markersRef.current = {}

      spots.forEach((spot) => {
        const icon = L.divIcon({
          html: markerHtml(spot.wifi_speed),
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
        const marker = L.marker([spot.lat, spot.lng], { icon })
          .addTo(mapRef.current!)
          .on('click', () => onSpotClickRef.current(spot))
        markersRef.current[spot.id] = marker
      })
    }

    sync()
  }, [spots, isMapReady])

  // Clean up temp marker when leaving adding mode
  useEffect(() => {
    if (!isAddingMode && tempMarkerRef.current) {
      tempMarkerRef.current.remove()
      tempMarkerRef.current = null
    }
  }, [isAddingMode])

  return <div ref={containerRef} className="w-full h-full" />
}
