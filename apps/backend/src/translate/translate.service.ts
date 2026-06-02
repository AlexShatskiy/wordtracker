import { Injectable, Logger } from '@nestjs/common';
import { WordsService } from '../words/words.service';
import { TranslationClient } from './translation-client';
import { TranslateDto } from './dto/translate.dto';
import { Lang, LANG_EN, LANG_RU, LANG_PL } from '../lang';
import { getCorrelationId } from '../common/correlation.store';

const CYRILLIC_RE = /[Ѐ-ӿ]/g;
const POLISH_RE = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;

function detectLang(term: string): Lang {
  const matches = term.match(CYRILLIC_RE);
  const ratio = matches ? matches.length / term.length : 0;
  if (ratio > 0.3) return LANG_RU;
  if (POLISH_RE.test(term)) return LANG_PL;
  return LANG_EN;
}

function defaultTarget(lang: Lang): Lang {
  if (lang === LANG_EN) return LANG_RU;
  if (lang === LANG_RU) return LANG_EN;
  return LANG_EN;
}

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);

  constructor(
    private readonly words: WordsService,
    private readonly client: TranslationClient,
  ) {}

  async translate(dto: TranslateDto) {
    const lang = dto.lang ?? detectLang(dto.term);
    const targetLang = dto.targetLang ?? defaultTarget(lang);

    this.logger.log(`[${getCorrelationId()}] term=${dto.term} lang=${lang}→${targetLang}`);
    const result = await this.client.translate(dto.term, lang, targetLang);

    const stored = this.words.recordLookup({
      term: dto.term,
      lang,
      targetLang,
      translation: result.translation,
      phonetic: result.phonetic,
      examples: result.examples,
    });

    return {
      id: stored.id,
      term: stored.term,
      lang: stored.lang,
      targetLang: stored.targetLang,
      phonetic: stored.phonetic,
      translation: stored.translation,
      examples: stored.examples,
      lookups: stored.lookups,
      source: result.source,
    };
  }
}
