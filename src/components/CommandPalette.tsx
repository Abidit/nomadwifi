'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import type { Spot } from '@/types/spot'

interface CommandPaletteProps {
  spots: Spot[]
  isOpen: boolean
  onClose: () => void
  onSpotSelect: (spot: Spot) => void
}

export default function CommandPalette({ spots, isOpen, onClose, onSpotSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const filtered = spots
    .filter((s) => {
      const q = query.toLowerCase()
      return (
        s.name.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.country?.toLowerCase().includes(q)
      )
    })
    .slice(0, 8)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && filtered[activeIndex]) {
        onSpotSelect(filtered[activeIndex])
        onClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  })

  if (!isOpen) return null

  return (
    <>
      {/* Full-screen backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '560px',
          maxWidth: '90vw',
          zIndex: 9999,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #ebebeb',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          background: '#ffffff',
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Search size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
            placeholder="Search spots..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              color: 'var(--text-primary)',
              minWidth: 0,
            }}
          />
          <kbd
            style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
              flexShrink: 0,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <p
              style={{
                fontSize: '14px',
                textAlign: 'center',
                padding: '32px 20px',
                color: 'var(--text-secondary)',
              }}
            >
              {query ? 'No spots found' : 'Start typing to search'}
            </p>
          ) : (
            filtered.map((spot, i) => (
              <button
                key={spot.id}
                onClick={() => { onSpotSelect(spot); onClose() }}
                onMouseEnter={() => setActiveIndex(i)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 20px',
                  background: i === activeIndex ? 'var(--bg)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                  {spot.name}
                </p>
                {(spot.city || spot.country) && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    {[spot.city, spot.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '10px 20px',
            borderTop: '1px solid var(--border)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          <span><kbd style={{ fontFamily: 'monospace' }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ fontFamily: 'monospace' }}>↵</kbd> select</span>
          <span><kbd style={{ fontFamily: 'monospace' }}>ESC</kbd> close</span>
        </div>
      </div>
    </>
  )
}
