import { Injectable } from '@nestjs/common';
import { Lang, LANG_EN, LANG_RU } from '../lang';

export type TranslationResult = {
  translation: string;
  examples: string[];
  source: 'mock';
};

@Injectable()
export class TranslationClient {
  translate(term: string, lang: Lang): TranslationResult {
    const target = lang === LANG_EN ? LANG_RU : LANG_EN;
    return {
      translation: `[mock] ${term} → ${target}`,
      examples: [`[mock] Example using "${term}" #1`, `[mock] Example using "${term}" #2`],
      source: 'mock',
    };
  }
}
