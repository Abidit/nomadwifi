'use client'

import { X } from 'lucide-react'
import type { Spot } from '@/types/spot'
import SpotCard from './SpotCard'
import AddSpotForm from './AddSpotForm'

interface RightPanelProps {
  isOpen: boolean
  activeTab: 'detail' | 'add'
  onTabChange: (tab: 'detail' | 'add') => void
  onClose: () => void
  selectedSpot: Spot | null
  onUpvote: (spotId: string) => void
  lat: number | null
  lng: number | null
  onSpotAdded: () => void
  isMobile: boolean
  onTransitionEnd?: () => void
}

export default function RightPanel({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  selectedSpot,
  onUpvote,
  lat,
  lng,
  onSpotAdded,
  isMobile,
  onTransitionEnd,
}: RightPanelProps) {
  const tabBtn = (tab: 'detail' | 'add', label: string) => (
    <button
      role="tab"
      aria-selected={activeTab === tab}
      onClick={() => onTabChange(tab)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        activeTab === tab
          ? 'bg-[#00A699] text-white'
          : 'hover:bg-[var(--bg)]'
      }`}
      style={activeTab !== tab ? { color: 'var(--text-secondary)' } : {}}
    >
      {label}
    </button>
  )

  const panelContent = (
    <div className="flex flex-col h-full" style={{ background: 'var(--panel-bg)' }}>
      {/* Tab bar */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex gap-1" role="tablist">
          {tabBtn('detail', 'Detail')}
          {tabBtn('add', 'Add Spot')}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'detail' && (
          selectedSpot ? (
            <SpotCard spot={selectedSpot} onUpvote={onUpvote} embedded />
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                Click a marker on the map to see spot details
              </p>
            </div>
          )
        )}
        {activeTab === 'add' && (
          <AddSpotForm lat={lat} lng={lng} onSpotAdded={onSpotAdded} />
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
          className="fixed bottom-0 left-0 right-0 z-[1001] rounded-t-2xl overflow-hidden transition-transform duration-300"
          style={{
            height: '72vh',
            transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {/* Drag handle */}
          <div
            className="flex justify-center pt-2 pb-1 flex-shrink-0"
            style={{ background: 'var(--panel-bg)' }}
          >
            <div className="w-8 h-1 rounded-full" style={{ background: 'var(--border)' }} />
          </div>
          {panelContent}
        </div>
      </>
    )
  }

  return (
    <div
      className="h-full flex-shrink-0 overflow-hidden transition-[width] duration-300"
      style={{ width: isOpen ? '360px' : '0', borderLeft: '1px solid var(--border)' }}
      onTransitionEnd={onTransitionEnd}
    >
      <div style={{ width: '360px', height: '100%' }}>
        {panelContent}
      </div>
    </div>
  )
}
