'use client'
import { useState } from 'react'
import { usePair } from '../lib/PairContext'
import { useTheme } from './ThemeProvider'
import { PairSwitcherPill } from './PairSwitcherPill'

type Props = {
  title?: string
  subtitle?: string
  onAvatarClick?: () => void
  onPairSwitcherOpen?: () => void
}

const SunIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M13 10A6 6 0 0 1 6 3a6 6 0 1 0 7 7z" />
  </svg>
)

const FlameIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M8 2C8 2 10.5 5 10.5 7.5C10.5 9 9.5 10.5 8 11C8 11 9 9.5 7.5 8.5C7.5 8.5 7 10 6 11C4.5 10 3.5 8.5 3.5 7C3.5 4.5 6 2 8 2Z"
      fill="currentColor"
    />
    <path
      d="M8 11C8 11 6.5 12.5 6.5 13.5C6.5 14.3 7.2 15 8 15C8.8 15 9.5 14.3 9.5 13.5C9.5 12.5 8 11 8 11Z"
      fill="currentColor"
    />
  </svg>
)

export function AppHeader({
  title = 'WordTracker',
  subtitle,
  onAvatarClick,
  onPairSwitcherOpen,
}: Props) {
  const { pair } = usePair()
  const { theme, toggle } = useTheme()
  const [streak] = useState(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem('wt-streak') ?? '0', 10)
  })
  const initials = subtitle?.split(', ')[1]?.[0] ?? 'A'

  return (
    <div style={{ padding: '12px 14px 8px', background: 'var(--bg-screen)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-muted)',
                marginTop: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            onClick={toggle}
            title={
              theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            }
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          {streak > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px 5px 8px',
                borderRadius: 100,
                background: 'var(--accent-tint)',
                color: 'var(--accent)',
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              <FlameIcon />
              {streak}
            </div>
          )}
          <button
            onClick={onAvatarClick}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              cursor: onAvatarClick ? 'pointer' : 'default',
              flexShrink: 0,
            }}
          >
            {initials}
          </button>
        </div>
      </div>

      {pair && onPairSwitcherOpen && (
        <div style={{ marginTop: 10 }}>
          <PairSwitcherPill pair={pair} onClick={onPairSwitcherOpen} />
        </div>
      )}
    </div>
  )
}
