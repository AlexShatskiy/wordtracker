interface Props {
  from: string
  to: string
}

export function LanguagePill({ from, to }: Props) {
  return (
    <div className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-bd)]">
      Detected: {from.toUpperCase()} → {to.toUpperCase()}
    </div>
  )
}
