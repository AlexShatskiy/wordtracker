export const LANG_EN = 'en' as const;
export const LANG_RU = 'ru' as const;

export type Lang = typeof LANG_EN | typeof LANG_RU;

export const SUPPORTED_LANGS = [LANG_EN, LANG_RU] as const;
