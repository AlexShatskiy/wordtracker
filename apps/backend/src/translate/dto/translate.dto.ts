import { Transform } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { SUPPORTED_LANGS } from '../../lang';
import type { Lang } from '../../lang';

export type { Lang };

const TERM_MAX_LENGTH = 50;

// Common prompt-injection trigger words. Checked case-insensitively against the full term.
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|prior|above|all)\s+instructions/i,
  /system\s*prompt/i,
  /you\s+are\s+now/i,
  /act\s+as\s+(a\s+)?/i,
  /jailbreak/i,
  /disregard\s+(all|any|previous)/i,
];

function IsNotPromptInjection(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotPromptInjection',
      target: object.constructor,
      propertyName,
      options: { message: 'term contains disallowed content', ...options },
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return true;
          return !PROMPT_INJECTION_PATTERNS.some((re) => re.test(value));
        },
      },
    });
  };
}

export class TranslateDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(TERM_MAX_LENGTH)
  // Printable Unicode letters/marks, digits, spaces, hyphens, apostrophes only.
  // Blocks null bytes, control chars, HTML tags, and other injection vectors.
  @Matches(/^[\p{L}\p{M}\p{N}\p{Z}\p{P}]+$/u, {
    message: 'term contains invalid characters',
  })
  @IsNotPromptInjection()
  term: string;

  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_LANGS)
  lang?: Lang;

  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_LANGS)
  targetLang?: Lang;
}
