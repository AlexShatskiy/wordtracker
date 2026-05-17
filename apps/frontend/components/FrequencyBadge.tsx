interface Props {
  count: number
}

export function FrequencyBadge({ count }: Props) {
  const cls =
    count >= 15
      ? 'bg-[var(--danger-bg)] text-[var(--danger-tx)] border-[var(--danger-bd)]'
      : count >= 5
      ? 'bg-[var(--warn-bg)] text-[var(--warn-tx)] border-[var(--warn-bd)]'
      : 'bg-[var(--ok-bg)] text-[var(--ok-tx)] border-[var(--ok-bd)]'

  return (
    <span className={`${cls} rounded-full px-2 py-[2px] text-[10px] font-medium border border-solid`}>
      {count}
    </span>
  )
}
