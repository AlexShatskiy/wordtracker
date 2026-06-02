import type { LangCode } from './pairs'

export type TranslateResponse = {
  id: string
  term: string
  lang: LangCode
  targetLang: LangCode
  phonetic: string
  translation: string
  examples: string[]
  lookups: number
  source: string
}

export type SavedWord = TranslateResponse & {
  saved: boolean
  lastSeenAt: string
  addedAt: string
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json() as Promise<T>
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json() as Promise<T>
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
}

export const api = {
  translate(term: string, lang: LangCode, targetLang: LangCode): Promise<TranslateResponse> {
    return post('/translate', { term, lang, targetLang })
  },

  listWords(lang?: LangCode, targetLang?: LangCode): Promise<{ data: SavedWord[] }> {
    const params = new URLSearchParams()
    if (lang) params.set('lang', lang)
    if (targetLang) params.set('targetLang', targetLang)
    return get(`/words?${params}`)
  },

  saveWord(id: string): Promise<void> {
    return post('/words/save', { id })
  },

  unsaveWord(id: string): Promise<void> {
    return del(`/words/${id}`)
  },
}
