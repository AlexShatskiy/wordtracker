import {
  BadRequestException,
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
  private readonly secret: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>(
      'TRANSLATION_SERVICE_URL',
      'http://localhost:8000',
    );
    this.secret = this.config.get<string>('INTERNAL_API_SECRET', '');
  }

  async translate(
    term: string,
    lang: Lang,
    targetLang: Lang,
  ): Promise<TranslationResult> {
    const headers: Record<string, string> = {};
    if (this.secret) headers['X-Internal-Secret'] = this.secret;

    try {
      const { data } = await axios.post<PythonResponse>(
        `${this.baseUrl}/translate`,
        {
          term,
          lang,
          target_lang: targetLang,
        },
        { headers },
      );
      return {
        translation: data.translation,
        phonetic: data.phonetic,
        examples: data.examples,
        source: data.source,
      };
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        this.logger.error(
          `Translation service ${status} for term=${term}: ${JSON.stringify(err.response.data)}`,
        );
        if (status >= 400 && status < 500) {
          throw new BadRequestException(
            err.response.data?.detail ?? 'Invalid translation request',
          );
        }
      } else {
        this.logger.error(`Translation service unreachable for term=${term}: ${err}`);
      }
      throw new ServiceUnavailableException('Translation service unavailable');
    }
  }
}
