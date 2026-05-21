import { Injectable, Logger } from '@nestjs/common';
import { WordsService } from '../words/words.service';
import { TranslationClient } from './translation-client';
import { TranslateDto } from './dto/translate.dto';
import { Lang, LANG_EN, LANG_RU } from '../lang';
import { getCorrelationId } from '../common/correlation.store';

const CYRILLIC_RE = /[Ѐ-ӿ]/g;

function detectLang(term: string): Lang {
  const matches = term.match(CYRILLIC_RE);
  const ratio = matches ? matches.length / term.length : 0;
  return ratio > 0.5 ? LANG_RU : LANG_EN;
}

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);

  constructor(
    private readonly words: WordsService,
    private readonly client: TranslationClient,
  ) {}

  translate(dto: TranslateDto) {
    const lang = dto.lang ?? detectLang(dto.term);
    const cached = this.words.findInDB(dto.term, lang);

    if (cached) {
      this.logger.debug(`[${getCorrelationId()}] cache hit term=${dto.term} lang=${lang}`);
      return cached;
    }

    this.logger.log(`[${getCorrelationId()}] cache miss term=${dto.term} lang=${lang} — calling translation service`);
    const result = this.client.translate(dto.term, lang);
    return { term: dto.term, lang, ...result };
  }
}
