import { badgeTier } from '../lib/words'

type Props = {
  count: number
}

const TIER_STYLES = {
  hard: {
    background: 'color-mix(in oklch, var(--danger) 14%, transparent)',
    color: 'var(--danger)',
    label: 'STUCK',
  },
  med: {
    background: 'color-mix(in oklch, var(--warning) 16%, transparent)',
    color: 'var(--warning)',
    label: 'OFTEN',
  },
  easy: {
    background: 'color-mix(in oklch, var(--success) 14%, transparent)',
    color: 'var(--success)',
    label: 'LEARNING',
  },
}

export function FrequencyBadge({ count }: Props) {
  const tier = badgeTier(count)
  const { background, color, label } = TIER_STYLES[tier]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 9px',
        borderRadius: 100,
        background,
        color,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count}×</span>
      <span style={{ opacity: 0.85 }}>{label}</span>
    </span>
  )
}
