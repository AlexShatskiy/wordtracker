import { type Pair } from '../lib/pairs'
import { LangChip } from './LangChip'

type Props = {
  pair: Pair
  onClick: () => void
}

export function PairSwitcherPill({ pair, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px 4px 4px',
        borderRadius: 100,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        fontFamily: 'inherit',
        cursor: 'pointer',
      }}
    >
      <LangChip lang={pair.from} size="sm" />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'var(--text-hint)' }}>
        <path
          d="M1 3.5h7M7 1.5l1.5 2L7 5.5M9 6.5H2M3 4.5l-1.5 2L3 8.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <LangChip lang={pair.to} size="sm" />
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ color: 'var(--text-hint)', marginLeft: 1 }}>
        <path
          d="m2 3 2.5 3L7 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
