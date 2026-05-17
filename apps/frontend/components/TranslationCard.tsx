interface Props {
  term: string
  lang: string
  phonetic: string
  translation: string
  examples: string[]
}

export function TranslationCard({ term, lang, phonetic, translation, examples }: Props) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-3">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[22px] font-medium text-[var(--tx-primary)] leading-tight">{term}</p>
          <p className="text-[12px] italic text-[var(--tx-hint)] mt-0.5">{phonetic}</p>
          <p className="text-[14px] font-medium text-[var(--accent)] mt-1">{translation}</p>
        </div>
        <span className="shrink-0 text-[10px] font-medium uppercase bg-[var(--bg-base)] border border-[var(--border)] rounded-full px-2 py-0.5 text-[var(--tx-hint)]">
          {lang.toUpperCase()}
        </span>
      </div>

      <div className="border-t border-[var(--border)] my-3" />

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--tx-hint)] mb-2">
          Examples
        </p>
        <div className="flex flex-col gap-2">
          {examples.map((ex, i) => (
            <p
              key={i}
              className="text-[11px] text-[var(--tx-muted)] leading-[1.55] pl-2 border-l-[1.5px] border-[var(--accent-bd)]"
            >
              {ex}
            </p>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-bd)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2h8v9L6 8.5 2 11V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          Save
        </button>
      </div>
    </div>
  )
}
