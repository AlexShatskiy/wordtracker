interface Props {
  count: number
}

export function StreakPill({ count }: Props) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-1 rounded-full px-2.5 py-1 bg-[var(--warn-bg)] text-[var(--warn-tx)] border border-[var(--warn-bd)]">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 0C5.5 2 3 3.5 3 6a3 3 0 0 0 6 0C9 3.5 6.5 2 6 0zM4.5 7c0-1.5.8-2.5 1.3-3 0 .9.4 1.4.9 1.4s.5-.9.5-1.4c.5.5.8 1.5.8 3a1.75 1.75 0 0 1-3.5 0z"/>
      </svg>
      <span className="text-[10px] font-medium">{count}</span>
    </div>
  )
}
