import { IsIn, IsOptional, IsString } from 'class-validator';
import { SUPPORTED_LANGS } from '../../lang';
import type { Lang } from '../../lang';

export class ListWordsDto {
  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_LANGS)
  lang?: Lang;

  @IsOptional()
  @IsString()
  @IsIn(SUPPORTED_LANGS)
  targetLang?: Lang;
}

export class SaveWordDto {
  @IsString()
  id: string;
}
