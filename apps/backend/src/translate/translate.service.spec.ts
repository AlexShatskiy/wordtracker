import { TranslateService } from './translate.service';
import { WordsService } from '../words/words.service';
import { TranslationClient } from './translation-client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const USER_ID = 'user-123';
const MOCK_LLM_RESULT = {
  translation: 'стол',
  phonetic: '/ˈteɪbəl/',
  examples: ['The table is wooden.'],
  source: 'gemini',
};

function makeMockWord(
  term: string,
  lang: string,
  targetLang: string,
  lookups = 1,
) {
  const translationId = `${term}:${lang}:${targetLang}`;
  return {
    id: `${USER_ID}:${translationId}`,
    userId: USER_ID,
    translationId,
    lookups,
    saved: false,
    lastSeenAt: new Date(),
    addedAt: new Date(),
  };
}

function makePrismaMock(cachedTranslation: unknown = null) {
  return {
    translation: {
      findUnique: jest.fn().mockResolvedValue(cachedTranslation),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve(data)),
    },
  } as unknown as PrismaService;
}

function makeWordsMock() {
  return {
    recordLookup: jest
      .fn()
      .mockImplementation((translationId: string) =>
        Promise.resolve(
          makeMockWord(
            ...(translationId.split(':') as [string, string, string]),
          ),
        ),
      ),
  } as unknown as WordsService;
}

describe('TranslateService', () => {
  let client: TranslationClient;

  beforeEach(() => {
    const cfg = {
      get: () => 'http://localhost:8000',
    } as unknown as ConfigService;
    client = new TranslationClient(cfg);
    jest.spyOn(client, 'translate').mockResolvedValue(MOCK_LLM_RESULT);
  });

  it('calls LLM on cache miss', async () => {
    const prisma = makePrismaMock(null);
    const svc = new TranslateService(prisma, makeWordsMock(), client);
    const result = await svc.translate({ term: 'table' }, USER_ID);
    expect(client.translate).toHaveBeenCalledTimes(1);
    expect(result.source).toBe('gemini');
  });

  it('skips LLM on cache hit', async () => {
    const cached = {
      id: 'table:en:ru',
      term: 'table',
      lang: 'en',
      targetLang: 'ru',
      translation: 'стол',
      phonetic: '/ˈteɪbəl/',
      examples: [],
      source: 'gemini',
    };
    const prisma = makePrismaMock(cached);
    const svc = new TranslateService(prisma, makeWordsMock(), client);
    const result = await svc.translate({ term: 'table' }, USER_ID);
    expect(client.translate).not.toHaveBeenCalled();
    expect(result.source).toBe('cache');
    expect(result.translation).toBe('стол');
  });

  it('detects language automatically', async () => {
    const prisma = makePrismaMock(null);
    const svc = new TranslateService(prisma, makeWordsMock(), client);
    const en = await svc.translate({ term: 'table' }, USER_ID);
    expect(en.lang).toBe('en');
    const ru = await svc.translate({ term: 'стол' }, USER_ID);
    expect(ru.lang).toBe('ru');
    const pl = await svc.translate({ term: 'żółw' }, USER_ID);
    expect(pl.lang).toBe('pl');
  });

  it('respects explicit lang and targetLang overrides', async () => {
    const prisma = makePrismaMock(null);
    const svc = new TranslateService(prisma, makeWordsMock(), client);
    const result = await svc.translate(
      { term: 'table', lang: 'en', targetLang: 'pl' },
      USER_ID,
    );
    expect(result.lang).toBe('en');
    expect(result.targetLang).toBe('pl');
  });
});
