import { FrequencyBadge } from './FrequencyBadge'

interface Props {
  term: string
  lang: string
  translation: string
  searchCount: number
}

export function WordItem({ term, lang, translation, searchCount }: Props) {
  return (
    <div className="flex items-center justify-between py-3 gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-[var(--tx-primary)] truncate">{term}</p>
        <p className="text-[10px] text-[var(--tx-hint)] mt-0.5 truncate">{translation}</p>
      </div>
      <FrequencyBadge count={searchCount} />
    </div>
  )
}
