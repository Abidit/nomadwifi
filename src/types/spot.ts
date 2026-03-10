export type WifiSpeed = 'slow' | 'medium' | 'fast'

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
  created_at: string
}
