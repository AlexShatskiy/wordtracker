import { type LangCode, type Pair } from './pairs'

export type Word = {
  id: string
  term: string
  lang: LangCode
  target: LangCode
  phonetic: string
  translation: string
  examples: string[]
  lookups: number
  lastSeen: string
  added: string
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
    (w.lang === pair.from && w.target === pair.to) ||
    (w.lang === pair.to && w.target === pair.from)
  return (
    SAMPLE_WORDS.find(w => inPair(w) && w.term.toLowerCase() === norm) ??
    SAMPLE_WORDS.find(w => inPair(w) && w.term.toLowerCase().startsWith(norm)) ??
    null
  )
}

export const SAMPLE_WORDS: Word[] = [
  // EN ↔ RU
  {
    id: 'w1', term: 'serendipity', lang: 'en', target: 'ru',
    phonetic: '/ˌsɛrənˈdɪpɪti/',
    translation: 'счастливая случайность; удачное стечение обстоятельств',
    examples: [
      'Finding that old letter was pure serendipity.',
      'Their meeting at the airport was a moment of serendipity.',
      'Science often relies on serendipity as much as method.',
    ],
    lookups: 17, lastSeen: '2 hours ago', added: 'May 02',
  },
  {
    id: 'w2', term: 'endeavor', lang: 'en', target: 'ru',
    phonetic: '/ɪnˈdɛvər/',
    translation: 'стремление, попытка; усердно стараться',
    examples: [
      'She will endeavor to finish the report by Friday.',
      'A worthy endeavor deserves patience.',
      'Despite his best endeavors, the bridge collapsed.',
    ],
    lookups: 12, lastSeen: 'Yesterday', added: 'Apr 28',
  },
  {
    id: 'w3', term: 'ubiquitous', lang: 'en', target: 'ru',
    phonetic: '/juːˈbɪkwɪtəs/',
    translation: 'вездесущий, повсеместный',
    examples: [
      'Coffee shops have become ubiquitous in modern cities.',
      'The ubiquitous smartphone reshapes daily habits.',
      'Plastic is ubiquitous — even in the deep ocean.',
    ],
    lookups: 16, lastSeen: '3 days ago', added: 'Apr 21',
  },
  {
    id: 'w4', term: 'resilient', lang: 'en', target: 'ru',
    phonetic: '/rɪˈzɪliənt/',
    translation: 'устойчивый, упругий; жизнестойкий',
    examples: [
      'A resilient economy bounces back quickly.',
      'Children are remarkably resilient after setbacks.',
      'The fabric is light yet resilient.',
    ],
    lookups: 8, lastSeen: 'Today', added: 'May 12',
  },
  {
    id: 'w5', term: 'elated', lang: 'en', target: 'ru',
    phonetic: '/ɪˈleɪtɪd/',
    translation: 'восторженный, в приподнятом настроении',
    examples: [
      'She was elated by the unexpected news.',
      'An elated crowd gathered in the square.',
    ],
    lookups: 3, lastSeen: 'Today', added: 'May 22',
  },
  {
    id: 'w6', term: 'обстоятельство', lang: 'ru', target: 'en',
    phonetic: '[ɐpstɐˈjatʲɪlʲstvə]',
    translation: 'circumstance; condition',
    examples: [
      'Под давлением обстоятельств он передумал.',
      'Это лишь смягчающее обстоятельство.',
      'Обстоятельства сложились удачно.',
    ],
    lookups: 9, lastSeen: 'Yesterday', added: 'May 05',
  },
  {
    id: 'w7', term: 'вдохновение', lang: 'ru', target: 'en',
    phonetic: '[vdəxnɐˈvʲenʲɪje]',
    translation: 'inspiration',
    examples: [
      'Художник черпает вдохновение из природы.',
      'Книга подарила мне вдохновение на месяцы.',
    ],
    lookups: 2, lastSeen: 'Today', added: 'May 24',
  },
  {
    id: 'w8', term: 'meticulous', lang: 'en', target: 'ru',
    phonetic: '/məˈtɪkjələs/',
    translation: 'дотошный, скрупулёзный',
    examples: [
      'A meticulous craftsman never rushes.',
      'Her meticulous notes saved the project.',
    ],
    lookups: 6, lastSeen: '4 days ago', added: 'Apr 30',
  },
  {
    id: 'w9', term: 'пожалуй', lang: 'ru', target: 'en',
    phonetic: '[pɐˈʐaɫʊj]',
    translation: "perhaps; I'd say; rather",
    examples: [
      'Пожалуй, я возьму чай.',
      'Это, пожалуй, лучший фильм года.',
    ],
    lookups: 1, lastSeen: 'Today', added: 'May 25',
  },
  // EN ↔ PL
  {
    id: 'w10', term: 'overwhelmed', lang: 'en', target: 'pl',
    phonetic: '/ˌəʊvəˈwɛlmd/',
    translation: 'przytłoczony, przygnieciony',
    examples: [
      'I felt overwhelmed by the amount of work.',
      'She was overwhelmed with gratitude.',
    ],
    lookups: 11, lastSeen: 'Today', added: 'May 18',
  },
  {
    id: 'w11', term: 'biblioteka', lang: 'pl', target: 'en',
    phonetic: '[bʲibʲlʲɔˈtɛka]',
    translation: 'library',
    examples: [
      'Spotkajmy się w bibliotece o trzeciej.',
      'Ta biblioteka ma świetny dział poezji.',
    ],
    lookups: 4, lastSeen: 'Today', added: 'May 24',
  },
  {
    id: 'w12', term: 'wprowadzenie', lang: 'pl', target: 'en',
    phonetic: '[fprɔvaˈd͡ʑɛɲɛ]',
    translation: 'introduction; preface',
    examples: [
      'Wprowadzenie do książki było bardzo długie.',
      'Profesor napisał krótkie wprowadzenie.',
    ],
    lookups: 7, lastSeen: 'Yesterday', added: 'May 09',
  },
  {
    id: 'w13', term: 'tantamount', lang: 'en', target: 'pl',
    phonetic: '/ˈtæntəmaʊnt/',
    translation: 'równoznaczny; równoważny',
    examples: [
      'Silence here is tantamount to consent.',
      'Such a remark is tantamount to an apology.',
    ],
    lookups: 15, lastSeen: '5 days ago', added: 'Apr 16',
  },
  // RU ↔ PL
  {
    id: 'w14', term: 'спотыкаться', lang: 'ru', target: 'pl',
    phonetic: '[spətɨˈkat͡sːə]',
    translation: 'potykać się',
    examples: [
      'Он постоянно спотыкается о порог.',
      'Не спотыкайся — здесь темно.',
    ],
    lookups: 5, lastSeen: '2 days ago', added: 'May 10',
  },
  {
    id: 'w15', term: 'spotkanie', lang: 'pl', target: 'ru',
    phonetic: '[spɔtˈkaɲɛ]',
    translation: 'встреча; собрание',
    examples: [
      'Spotkanie zostało przełożone na piątek.',
      'To było przypadkowe spotkanie.',
    ],
    lookups: 3, lastSeen: 'Today', added: 'May 23',
  },
]
