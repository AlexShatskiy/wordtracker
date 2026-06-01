'use client'
import { usePair } from '../lib/PairContext'
import { PairSwitcherPill } from './PairSwitcherPill'

type Props = {
  title?: string
  subtitle?: string
  streak?: number
  onAvatarClick?: () => void
  onPairSwitcherOpen?: () => void
}

const FlameIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M8 2C8 2 10.5 5 10.5 7.5C10.5 9 9.5 10.5 8 11C8 11 9 9.5 7.5 8.5C7.5 8.5 7 10 6 11C4.5 10 3.5 8.5 3.5 7C3.5 4.5 6 2 8 2Z" fill="currentColor"/>
    <path d="M8 11C8 11 6.5 12.5 6.5 13.5C6.5 14.3 7.2 15 8 15C8.8 15 9.5 14.3 9.5 13.5C9.5 12.5 8 11 8 11Z" fill="currentColor"/>
  </svg>
)

export function AppHeader({
  title = 'WordTracker',
  subtitle,
  streak = 0,
  onAvatarClick,
  onPairSwitcherOpen,
}: Props) {
  const { pair } = usePair()
  const initials = subtitle?.split(', ')[1]?.[0] ?? 'A'

  return (
    <div style={{ padding: '12px 14px 8px', background: 'var(--bg-screen)' }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {streak > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 10px 5px 8px', borderRadius: 100,
              background: 'var(--accent-tint)', color: 'var(--accent)',
              fontSize: 11.5, fontWeight: 600,
            }}>
              <FlameIcon />
              {streak}
            </div>
          )}
          <button
            onClick={onAvatarClick}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff',
              fontSize: 13, fontWeight: 500, border: 'none',
              cursor: onAvatarClick ? 'pointer' : 'default',
              flexShrink: 0,
            }}
          >
            {initials}
          </button>
        </div>
      </div>

      {/* PairSwitcher pill */}
      {pair && onPairSwitcherOpen && (
        <div style={{ marginTop: 10 }}>
          <PairSwitcherPill pair={pair} onClick={onPairSwitcherOpen} />
        </div>
      )}
    </div>
  )
}
