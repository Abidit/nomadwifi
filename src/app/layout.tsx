import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Wifi } from 'lucide-react'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'NomadWifi — Find Fast Wifi for Digital Nomads',
  description:
    'Crowdsourced map of wifi spots for digital nomads worldwide. Find cafes and coworking spaces with fast internet and power backup.',
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
