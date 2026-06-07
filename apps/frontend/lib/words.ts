import { type LangCode, type Pair } from './pairs'

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

export function findResult(q: string, pair: Pair): Word | null {
  if (!q) return null
  const norm = q.trim().toLowerCase()
  const inPair = (w: Word) =>
    (w.lang === pair.from && w.targetLang === pair.to) ||
    (w.lang === pair.to && w.targetLang === pair.from)
  return (
    SAMPLE_WORDS.find((w) => inPair(w) && w.term.toLowerCase() === norm) ??
    SAMPLE_WORDS.find(
      (w) => inPair(w) && w.term.toLowerCase().startsWith(norm),
    ) ??
    null
  )
}

export const SAMPLE_WORDS: Word[] = [
  // EN ↔ RU
  {
    id: 'w1',
    term: 'serendipity',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/ˌsɛrənˈdɪpɪti/',
    translation: 'счастливая случайность; удачное стечение обстоятельств',
    examples: [
      'Finding that old letter was pure serendipity.',
      'Their meeting at the airport was a moment of serendipity.',
      'Science often relies on serendipity as much as method.',
    ],
    lookups: 17,
    lastSeenAt: new Date(Date.now() - 7200000).toISOString(),
    addedAt: '2026-05-02T00:00:00.000Z',
  },
  {
    id: 'w2',
    term: 'endeavor',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/ɪnˈdɛvər/',
    translation: 'стремление, попытка; усердно стараться',
    examples: [
      'She will endeavor to finish the report by Friday.',
      'A worthy endeavor deserves patience.',
    ],
    lookups: 12,
    lastSeenAt: new Date(Date.now() - 86400000).toISOString(),
    addedAt: '2026-04-28T00:00:00.000Z',
  },
  {
    id: 'w3',
    term: 'ubiquitous',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/juːˈbɪkwɪtəs/',
    translation: 'вездесущий, повсеместный',
    examples: [
      'Coffee shops have become ubiquitous in modern cities.',
      'Plastic is ubiquitous — even in the deep ocean.',
    ],
    lookups: 16,
    lastSeenAt: new Date(Date.now() - 259200000).toISOString(),
    addedAt: '2026-04-21T00:00:00.000Z',
  },
  {
    id: 'w4',
    term: 'resilient',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/rɪˈzɪliənt/',
    translation: 'устойчивый, упругий; жизнестойкий',
    examples: [
      'A resilient economy bounces back quickly.',
      'Children are remarkably resilient after setbacks.',
    ],
    lookups: 8,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-12T00:00:00.000Z',
  },
  {
    id: 'w5',
    term: 'elated',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/ɪˈleɪtɪd/',
    translation: 'восторженный, в приподнятом настроении',
    examples: [
      'She was elated by the unexpected news.',
      'An elated crowd gathered in the square.',
    ],
    lookups: 3,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-22T00:00:00.000Z',
  },
  {
    id: 'w6',
    term: 'обстоятельство',
    lang: 'ru',
    targetLang: 'en',
    phonetic: '[ɐpstɐˈjatʲɪlʲstvə]',
    translation: 'circumstance; condition',
    examples: [
      'Под давлением обстоятельств он передумал.',
      'Обстоятельства сложились удачно.',
    ],
    lookups: 9,
    lastSeenAt: new Date(Date.now() - 86400000).toISOString(),
    addedAt: '2026-05-05T00:00:00.000Z',
  },
  {
    id: 'w7',
    term: 'вдохновение',
    lang: 'ru',
    targetLang: 'en',
    phonetic: '[vdəxnɐˈvʲenʲɪje]',
    translation: 'inspiration',
    examples: ['Художник черпает вдохновение из природы.'],
    lookups: 2,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-24T00:00:00.000Z',
  },
  {
    id: 'w8',
    term: 'meticulous',
    lang: 'en',
    targetLang: 'ru',
    phonetic: '/məˈtɪkjələs/',
    translation: 'дотошный, скрупулёзный',
    examples: ['A meticulous craftsman never rushes.'],
    lookups: 6,
    lastSeenAt: new Date(Date.now() - 345600000).toISOString(),
    addedAt: '2026-04-30T00:00:00.000Z',
  },
  {
    id: 'w9',
    term: 'пожалуй',
    lang: 'ru',
    targetLang: 'en',
    phonetic: '[pɐˈʐaɫʊj]',
    translation: "perhaps; I'd say; rather",
    examples: ['Пожалуй, я возьму чай.'],
    lookups: 1,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-25T00:00:00.000Z',
  },
  // EN ↔ PL
  {
    id: 'w10',
    term: 'overwhelmed',
    lang: 'en',
    targetLang: 'pl',
    phonetic: '/ˌəʊvəˈwɛlmd/',
    translation: 'przytłoczony, przygnieciony',
    examples: ['I felt overwhelmed by the amount of work.'],
    lookups: 11,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-18T00:00:00.000Z',
  },
  {
    id: 'w11',
    term: 'biblioteka',
    lang: 'pl',
    targetLang: 'en',
    phonetic: '[bʲibʲlʲɔˈtɛka]',
    translation: 'library',
    examples: ['Spotkajmy się w bibliotece o trzeciej.'],
    lookups: 4,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-24T00:00:00.000Z',
  },
  {
    id: 'w12',
    term: 'wprowadzenie',
    lang: 'pl',
    targetLang: 'en',
    phonetic: '[fprɔvaˈd͡ʑɛɲɛ]',
    translation: 'introduction; preface',
    examples: ['Wprowadzenie do książki było bardzo długie.'],
    lookups: 7,
    lastSeenAt: new Date(Date.now() - 86400000).toISOString(),
    addedAt: '2026-05-09T00:00:00.000Z',
  },
  {
    id: 'w13',
    term: 'tantamount',
    lang: 'en',
    targetLang: 'pl',
    phonetic: '/ˈtæntəmaʊnt/',
    translation: 'równoznaczny; równoważny',
    examples: ['Silence here is tantamount to consent.'],
    lookups: 15,
    lastSeenAt: new Date(Date.now() - 432000000).toISOString(),
    addedAt: '2026-04-16T00:00:00.000Z',
  },
  // RU ↔ PL
  {
    id: 'w14',
    term: 'спотыкаться',
    lang: 'ru',
    targetLang: 'pl',
    phonetic: '[spətɨˈkat͡sːə]',
    translation: 'potykać się',
    examples: ['Он постоянно спотыкается о порог.'],
    lookups: 5,
    lastSeenAt: new Date(Date.now() - 172800000).toISOString(),
    addedAt: '2026-05-10T00:00:00.000Z',
  },
  {
    id: 'w15',
    term: 'spotkanie',
    lang: 'pl',
    targetLang: 'ru',
    phonetic: '[spɔtˈkaɲɛ]',
    translation: 'встреча; собрание',
    examples: ['Spotkanie zostało przełożone na piątek.'],
    lookups: 3,
    lastSeenAt: new Date().toISOString(),
    addedAt: '2026-05-23T00:00:00.000Z',
  },
]
