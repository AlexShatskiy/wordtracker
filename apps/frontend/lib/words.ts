import { type LangCode } from './pairs'

export type Word = {
  id: string
  term: string
  lang: LangCode
  targetLang: LangCode
  phonetic: string
  translation: string
  examples: string[]
  lookups: number
  lastSeenAt: string
  addedAt: string
}

export function badgeTier(count: number): 'hard' | 'med' | 'easy' {
  if (count >= 15) return 'hard'
  if (count >= 5) return 'med'
  return 'easy'
}

export function detectLang(q: string): LangCode {
  if (!q) return 'en'
  const cyr = (q.match(/[Ѐ-ӿ]/g) ?? []).length
  const pol = (q.match(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g) ?? []).length
  if (cyr / q.length > 0.3) return 'ru'
  if (pol > 0) return 'pl'
  return 'en'
}
