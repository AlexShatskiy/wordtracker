export type LangCode = 'en' | 'ru' | 'pl'

export type Pair = { from: LangCode; to: LangCode }

export const LANG_NAMES: Record<LangCode, string> = {
  en: 'English',
  ru: 'Russian',
  pl: 'Polish',
}

export const LANG_CHIP_COLORS: Record<LangCode, { fg: string; bg: string }> = {
  en: { fg: '#4285F4', bg: 'color-mix(in oklch, #4285F4 16%, transparent)' },
  ru: { fg: '#B33B30', bg: 'color-mix(in oklch, #B33B30 16%, transparent)' },
  pl: { fg: '#6A8C3F', bg: 'color-mix(in oklch, #6A8C3F 18%, transparent)' },
}

const LANGS: LangCode[] = ['en', 'ru', 'pl']

export function ALL_PAIRS(): Pair[] {
  const pairs: Pair[] = []
  for (let i = 0; i < LANGS.length; i++) {
    for (let j = i + 1; j < LANGS.length; j++) {
      pairs.push({ from: LANGS[i], to: LANGS[j] })
    }
  }
  return pairs
}

export function pairId(p: Pair): string {
  return [p.from, p.to].sort().join('-')
}

export function pairsEqual(a: Pair, b: Pair): boolean {
  return pairId(a) === pairId(b)
}
