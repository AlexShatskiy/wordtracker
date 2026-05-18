import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { SUPPORTED_LANGS } from '../../lang';
import type { Lang } from '../../lang';

export type { Lang };

export class TranslateDto {
  @IsString()
  @MinLength(1)
  term: string;

  @IsOptional()
  @IsIn(SUPPORTED_LANGS)
  lang?: Lang;
}
