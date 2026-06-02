import { Injectable } from '@nestjs/common';
import { Lang } from '../lang';

export type StoredWord = {
  id: string;
  term: string;
  lang: Lang;
  targetLang: Lang;
  translation: string;
  phonetic: string;
  examples: string[];
  lookups: number;
  saved: boolean;
  lastSeenAt: Date;
  addedAt: Date;
};

type WordInput = Omit<StoredWord, 'id' | 'lookups' | 'saved' | 'lastSeenAt' | 'addedAt'>;

@Injectable()
export class WordsService {
  private readonly store = new Map<string, StoredWord>();

  private wordId(term: string, lang: Lang, targetLang: Lang): string {
    return `${term.toLowerCase()}:${lang}:${targetLang}`;
  }

  findInDB(_term: string, _lang: string): null {
    return null;
  }

  recordLookup(word: WordInput): StoredWord {
    const id = this.wordId(word.term, word.lang, word.targetLang);
    const existing = this.store.get(id);
    if (existing) {
      existing.lookups += 1;
      existing.lastSeenAt = new Date();
      return existing;
    }
    const entry: StoredWord = {
      ...word,
      id,
      lookups: 1,
      saved: false,
      lastSeenAt: new Date(),
      addedAt: new Date(),
    };
    this.store.set(id, entry);
    return entry;
  }

  save(id: string): void {
    const word = this.store.get(id);
    if (word) word.saved = true;
  }

  unsave(id: string): void {
    const word = this.store.get(id);
    if (word) word.saved = false;
  }

  listSaved(lang?: Lang, targetLang?: Lang): StoredWord[] {
    return [...this.store.values()].filter((w) => {
      if (!w.saved) return false;
      if (lang && w.lang !== lang) return false;
      if (targetLang && w.targetLang !== targetLang) return false;
      return true;
    });
  }

  getById(id: string): StoredWord | null {
    return this.store.get(id) ?? null;
  }
}
