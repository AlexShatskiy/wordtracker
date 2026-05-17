import { StreakPill } from './StreakPill'
import { ThemeToggle } from './ThemeToggle'
import { mockStreak } from '../lib/mock'

interface Props {
  title?: string
  subtitle?: string
}

export function AppHeader({ title = 'WordTracker', subtitle = 'Good morning, Alex' }: Props) {
  return (
    <div className="flex items-center justify-between px-3 pt-4 pb-3 bg-[var(--bg-screen)]">
      <div>
        <h1 className="text-[18px] font-semibold text-[var(--tx-primary)] leading-tight">{title}</h1>
        <p className="text-[12px] text-[var(--tx-muted)] mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <StreakPill count={mockStreak.current} />
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
          AS
        </div>
      </div>
    </div>
  )
}
