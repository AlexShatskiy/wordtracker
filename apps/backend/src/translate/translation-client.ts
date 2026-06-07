import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Lang } from '../lang';

export type TranslationResult = {
  translation: string;
  phonetic: string;
  examples: string[];
  source: string;
};

type PythonResponse = {
  term: string;
  lang: string;
  translation: string;
  phonetic: string;
  examples: string[];
  source: string;
};

@Injectable()
export class TranslationClient {
  private readonly logger = new Logger(TranslationClient.name);
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>(
      'TRANSLATION_SERVICE_URL',
      'http://localhost:8000',
    );
  }

  async translate(
    term: string,
    lang: Lang,
    targetLang: Lang,
  ): Promise<TranslationResult> {
    try {
      const { data } = await axios.post<PythonResponse>(
        `${this.baseUrl}/translate`,
        {
          term,
          lang,
          target_lang: targetLang,
        },
      );
      return {
        translation: data.translation,
        phonetic: data.phonetic,
        examples: data.examples,
        source: data.source,
      };
    } catch (err) {
      this.logger.error(`Translation service error for term=${term}: ${err}`);
      throw new ServiceUnavailableException('Translation service unavailable');
    }
  }
}
