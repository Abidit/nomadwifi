import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Wifi } from 'lucide-react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL('https://nomadwifi.vercel.app'),
  title: 'NomadWifi — Fast Wifi Spots for Digital Nomads Worldwide',
  description: 'Crowdsourced map of wifi spots for digital nomads and remote workers. Find cafes and coworking spaces with fast internet and power backup in Kathmandu, Bali, Lisbon and beyond.',
  keywords: ['digital nomad', 'wifi map', 'remote work', 'coworking', 'fast wifi', 'nomad wifi', 'Kathmandu wifi', 'work from cafe'],
  authors: [{ name: 'NomadWifi' }],
  creator: 'NomadWifi',
  openGraph: {
    type: 'website',
    url: 'https://nomadwifi.vercel.app',
    title: 'NomadWifi — Find Fast Wifi for Digital Nomads',
    description: 'Crowdsourced map of wifi spots worldwide. Find fast internet and power backup for remote work.',
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
    title: 'NomadWifi — Find Fast Wifi for Digital Nomads',
    description: 'Crowdsourced map of wifi spots worldwide for remote workers.',
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
      <body className="bg-white antialiased font-sans">
        <header className="h-16 bg-white border-b border-[#ebebeb] flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Wifi size={20} className="text-[#00A699]" />
            <span className="font-bold text-[#222222] text-lg tracking-tight">NomadWifi</span>
          </div>
          <span className="text-sm text-[#717171]">Find wifi spots worldwide</span>
        </header>
        {children}
      </body>
    </html>
  )
}
