'use client'
import { useState } from 'react'
import { WordItem } from './WordItem'

type Filter = 'all' | 'en-ru' | 'ru-en'

interface Word {
  id: number
  term: string
  lang: string
  translation: string
  searchCount: number
}

interface Props {
  words: Word[]
}

export function WordList({ words }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const totalCount = words.length
  const hardCount = words.filter(w => w.searchCount >= 15).length
  const todayCount = 3

  const filtered =
    filter === 'en-ru'
      ? words.filter(w => w.lang === 'en')
      : filter === 'ru-en'
      ? words.filter(w => w.lang === 'ru')
      : words

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'en-ru', label: 'EN→RU' },
    { key: 'ru-en', label: 'RU→EN' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] p-2.5 text-center">
          <p className="text-[16px] font-medium text-[var(--tx-primary)]">{totalCount}</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--tx-hint)] mt-0.5">Total</p>
        </div>
        <div className="bg-[var(--danger-bg)] border border-[var(--danger-bd)] rounded-[10px] p-2.5 text-center">
          <p className="text-[16px] font-medium text-[var(--danger-tx)]">{hardCount}</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--danger-tx)] mt-0.5">Hard</p>
        </div>
        <div className="bg-[var(--accent-tint)] border border-[var(--accent-bd)] rounded-[10px] p-2.5 text-center">
          <p className="text-[16px] font-medium text-[var(--accent)]">{todayCount}</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--accent)] mt-0.5">Today</p>
        </div>
      </div>

      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors border ${
              filter === f.key
                ? 'bg-[var(--accent-tint)] text-[var(--accent)] border-[var(--accent-bd)]'
                : 'text-[var(--tx-hint)] border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[13px] px-4">
        {filtered.map((word, i) => (
          <div key={word.id}>
            {i > 0 && <div className="border-t border-[var(--border)]" />}
            <WordItem
              term={word.term}
              lang={word.lang}
              translation={word.translation}
              searchCount={word.searchCount}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
