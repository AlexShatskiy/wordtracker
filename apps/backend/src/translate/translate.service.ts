import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WordsService } from '../words/words.service';
import { TranslationClient } from './translation-client';
import { TranslateDto } from './dto/translate.dto';
import { Lang, LANG_EN, LANG_PL, LANG_RU } from '../lang';
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
    private readonly prisma: PrismaService,
    private readonly words: WordsService,
    private readonly client: TranslationClient,
  ) {}

  async translate(dto: TranslateDto, userId: string) {
    const term = dto.term.trim().toLowerCase();
    const lang = dto.lang ?? detectLang(term);
    const targetLang = dto.targetLang ?? defaultTarget(lang);
    const translationId = `${term}:${lang}:${targetLang}`;

    this.logger.log(
      `[${getCorrelationId()}] term=${term} lang=${lang}→${targetLang}`,
    );

    // Check shared cache first — skip LLM if already translated by anyone
    const cached = await this.prisma.translation.findUnique({
      where: { id: translationId },
    });

    let translation: NonNullable<typeof cached>;
    if (cached) {
      translation = cached;
    } else {
      const result = await this.client.translate(term, lang, targetLang);
      translation = await this.prisma.translation.create({
        data: {
          id: translationId,
          term,
          lang,
          targetLang,
          translation: result.translation,
          phonetic: result.phonetic,
          examples: result.examples,
          source: result.source,
        },
      });
    }

    const word = await this.words.recordLookup(translationId, userId);

    return {
      id: word.id,
      term: translation.term,
      lang: translation.lang,
      targetLang: translation.targetLang,
      phonetic: translation.phonetic,
      translation: translation.translation,
      examples: translation.examples,
      lookups: word.lookups,
      source: cached ? 'cache' : translation.source,
    };
  }
}
