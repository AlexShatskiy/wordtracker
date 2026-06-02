export const LANG_EN = 'en' as const;
export const LANG_RU = 'ru' as const;
export const LANG_PL = 'pl' as const;

export type Lang = typeof LANG_EN | typeof LANG_RU | typeof LANG_PL;

export const SUPPORTED_LANGS = [LANG_EN, LANG_RU, LANG_PL] as const;
