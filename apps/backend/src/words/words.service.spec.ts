import { WordsService } from './words.service';
import { PrismaService } from '../prisma/prisma.service';

const USER_ID = 'user-123';
const TRANSLATION_ID = 'table:en:ru';
const WORD_ID = `${USER_ID}:${TRANSLATION_ID}`;

const MOCK_TRANSLATION = {
  id: TRANSLATION_ID,
  term: 'table',
  lang: 'en',
  targetLang: 'ru',
  translation: 'стол',
  phonetic: '/ˈteɪbəl/',
  examples: ['The table is wooden.'],
  source: 'gemini',
  createdAt: new Date(),
};

function makeWord(overrides = {}) {
  return {
    id: WORD_ID,
    userId: USER_ID,
    translationId: TRANSLATION_ID,
    lookups: 1,
    saved: false,
    lastSeenAt: new Date(),
    addedAt: new Date(),
    translation: MOCK_TRANSLATION,
    ...overrides,
  };
}

function makePrismaMock() {
  return {
    word: {
      upsert: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  } as unknown as PrismaService;
}

describe('WordsService', () => {
  let service: WordsService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new WordsService(prisma);
  });

  it('recordLookup upserts word with correct ids', async () => {
    const word = makeWord();
    (prisma.word.upsert as jest.Mock).mockResolvedValue(word);
    const result = await service.recordLookup(TRANSLATION_ID, USER_ID);
    expect(prisma.word.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: WORD_ID },
        create: expect.objectContaining({
          userId: USER_ID,
          translationId: TRANSLATION_ID,
        }),
      }),
    );
    expect(result.id).toBe(WORD_ID);
  });

  it('save updates saved=true', async () => {
    (prisma.word.update as jest.Mock).mockResolvedValue({});
    await service.save(WORD_ID, USER_ID);
    expect(prisma.word.update).toHaveBeenCalledWith({
      where: { id: WORD_ID, userId: USER_ID },
      data: { saved: true },
    });
  });

  it('unsave updates saved=false', async () => {
    (prisma.word.update as jest.Mock).mockResolvedValue({});
    await service.unsave(WORD_ID, USER_ID);
    expect(prisma.word.update).toHaveBeenCalledWith({
      where: { id: WORD_ID, userId: USER_ID },
      data: { saved: false },
    });
  });

  it('listSaved includes userId filter', async () => {
    const word = makeWord({ saved: true });
    (prisma.word.findMany as jest.Mock).mockResolvedValue([word]);
    const list = await service.listSaved(USER_ID);
    expect(prisma.word.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID }),
      }),
    );
    expect(list[0].translation.term).toBe('table');
  });

  it('getById returns null for unknown word', async () => {
    (prisma.word.findFirst as jest.Mock).mockResolvedValue(null);
    expect(await service.getById('unknown', USER_ID)).toBeNull();
  });
});
