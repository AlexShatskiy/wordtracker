import { WordsService } from './words.service';

const WORD_INPUT = {
  term: 'table',
  lang: 'en' as const,
  targetLang: 'ru' as const,
  translation: 'стол',
  phonetic: '/ˈteɪbəl/',
  examples: ['The table is wooden.'],
};

describe('WordsService', () => {
  let service: WordsService;

  beforeEach(() => {
    service = new WordsService();
  });

  it('recordLookup creates entry with lookups=1', () => {
    const result = service.recordLookup(WORD_INPUT);
    expect(result.lookups).toBe(1);
    expect(result.saved).toBe(false);
    expect(result.id).toBe('table:en:ru');
  });

  it('recordLookup increments lookups on repeated calls', () => {
    service.recordLookup(WORD_INPUT);
    const result = service.recordLookup(WORD_INPUT);
    expect(result.lookups).toBe(2);
  });

  it('save marks word as saved', () => {
    const entry = service.recordLookup(WORD_INPUT);
    service.save(entry.id);
    expect(service.getById(entry.id)?.saved).toBe(true);
  });

  it('unsave marks word as not saved', () => {
    const entry = service.recordLookup(WORD_INPUT);
    service.save(entry.id);
    service.unsave(entry.id);
    expect(service.getById(entry.id)?.saved).toBe(false);
  });

  it('listSaved returns only saved words', () => {
    const a = service.recordLookup(WORD_INPUT);
    service.recordLookup({ ...WORD_INPUT, term: 'chair', translation: 'стул' });
    service.save(a.id);
    const list = service.listSaved();
    expect(list).toHaveLength(1);
    expect(list[0].term).toBe('table');
  });

  it('listSaved filters by lang', () => {
    const a = service.recordLookup(WORD_INPUT);
    const b = service.recordLookup({
      ...WORD_INPUT,
      term: 'стул',
      lang: 'ru',
      targetLang: 'en',
      translation: 'chair',
    });
    service.save(a.id);
    service.save(b.id);
    const list = service.listSaved('en');
    expect(list).toHaveLength(1);
    expect(list[0].term).toBe('table');
  });

  it('listSaved filters by targetLang', () => {
    const a = service.recordLookup(WORD_INPUT);
    const b = service.recordLookup({
      ...WORD_INPUT,
      term: 'stół',
      lang: 'pl',
      targetLang: 'en',
      translation: 'table',
    });
    service.save(a.id);
    service.save(b.id);
    const list = service.listSaved(undefined, 'ru');
    expect(list).toHaveLength(1);
    expect(list[0].targetLang).toBe('ru');
  });

  it('getById returns null for unknown id', () => {
    expect(service.getById('nonexistent:en:ru')).toBeNull();
  });
});
