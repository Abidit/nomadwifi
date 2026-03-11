import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL('https://nomadwifi.vercel.app'),
  title: 'NomadWifi — Fast Wifi Spots for Digital Nomads Worldwide',
  description: 'Crowdsourced map of wifi spots for digital nomads and remote workers. Find cafes and coworking spaces with fast internet and power backup in Kathmandu, Bali, Lisbon and beyond.',
  keywords: ['digital nomad', 'wifi map', 'remote work', 'coworking', 'fast wifi', 'nomad wifi', 'Kathmandu wifi'],
  openGraph: {
    type: 'website',
    url: 'https://nomadwifi.vercel.app',
    title: 'NomadWifi — Fast Wifi Spots for Digital Nomads Worldwide',
    description: 'Crowdsourced map of wifi spots for digital nomads and remote workers. Find cafes and coworking spaces with fast internet and power backup in Kathmandu, Bali, Lisbon and beyond.',
    siteName: 'NomadWifi',
    images: [{
      url: 'https://nomadwifi.vercel.app/og-image.png',
      width: 1200,
      height: 630,
      alt: 'NomadWifi - Crowdsourced Wifi Map for Digital Nomads',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NomadWifi — Fast Wifi Spots for Digital Nomads Worldwide',
    description: 'Crowdsourced map of wifi spots for digital nomads and remote workers. Find cafes and coworking spaces with fast internet and power backup in Kathmandu, Bali, Lisbon and beyond.',
    images: ['https://nomadwifi.vercel.app/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans overflow-hidden" style={{ background: 'var(--bg)' }}>
        {children}
      </body>
    </html>
  )
}
