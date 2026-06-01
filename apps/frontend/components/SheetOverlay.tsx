'use client'
import { type ReactNode } from 'react'

type Props = {
  onClose: () => void
  half?: boolean
  children: ReactNode
}

export function SheetOverlay({ onClose, half = false, children }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.18)',
          animation: 'wtSheetFadeIn 0.2s ease-out',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: half ? 'auto' : 0,
          maxHeight: half ? '78%' : '100%',
          background: 'var(--bg-card)',
          borderRadius: '18px 18px 0 0',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
          animation: 'wtSheetIn 0.28s cubic-bezier(0.2,0.8,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
