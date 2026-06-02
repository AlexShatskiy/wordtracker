import { TranslateService } from './translate.service';
import { WordsService } from '../words/words.service';
import { TranslationClient } from './translation-client';
import { ConfigService } from '@nestjs/config';

const MOCK_RESULT = {
  translation: 'test translation',
  phonetic: '/test/',
  examples: ['example sentence'],
  source: 'mock',
};

describe('TranslateService — language detection', () => {
  let service: TranslateService;

  beforeEach(() => {
    const config = { get: () => 'http://localhost:8000' } as unknown as ConfigService;
    const client = new TranslationClient(config);
    jest.spyOn(client, 'translate').mockResolvedValue(MOCK_RESULT);
    service = new TranslateService(new WordsService(), client);
  });

  it('detects English for latin term', async () => {
    const result = await service.translate({ term: 'table' });
    expect(result.lang).toBe('en');
    expect(result.targetLang).toBe('ru');
  });

  it('detects Russian for Cyrillic term', async () => {
    const result = await service.translate({ term: 'стол' });
    expect(result.lang).toBe('ru');
    expect(result.targetLang).toBe('en');
  });

  it('detects Polish for term with Polish diacritics', async () => {
    const result = await service.translate({ term: 'żółw' });
    expect(result.lang).toBe('pl');
    expect(result.targetLang).toBe('en');
  });

  it('respects explicit lang override', async () => {
    const result = await service.translate({ term: 'table', lang: 'pl' });
    expect(result.lang).toBe('pl');
  });

  it('respects explicit targetLang override', async () => {
    const result = await service.translate({ term: 'table', targetLang: 'pl' });
    expect(result.targetLang).toBe('pl');
  });

  it('increments lookups on repeated translate', async () => {
    await service.translate({ term: 'table' });
    const second = await service.translate({ term: 'table' });
    expect(second.lookups).toBe(2);
  });
});
