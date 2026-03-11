export type WifiSpeed = 'slow' | 'medium' | 'fast'
export type NoiseLevel = 'quiet' | 'moderate' | 'loud'
export type PowerOutlets = 'none' | 'limited' | 'plenty'

export interface Spot {
  id: string
  name: string
  description?: string
  lat: number
  lng: number
  wifi_speed: WifiSpeed
  power_backup: boolean
  upvotes: number
  city?: string
  country?: string
  noise_level?: NoiseLevel
  power_outlets?: PowerOutlets
  created_at: string
}
