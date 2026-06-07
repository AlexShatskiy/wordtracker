import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { WordsService, WordWithTranslation } from './words.service';
import { ListWordsDto, SaveWordDto } from './dto/words.dto';

function toResponse(word: WordWithTranslation) {
  const t = word.translation;
  return {
    id: word.id,
    term: t.term,
    lang: t.lang,
    targetLang: t.targetLang,
    translation: t.translation,
    phonetic: t.phonetic,
    examples: t.examples,
    lookups: word.lookups,
    saved: word.saved,
    lastSeenAt: word.lastSeenAt,
    addedAt: word.addedAt,
  };
}

@Controller('words')
@UseGuards(JwtAuthGuard)
export class WordsController {
  constructor(private readonly words: WordsService) {}

  @Get()
  async list(@Query() dto: ListWordsDto, @Req() req: Request) {
    const { sub: userId } = req.user as JwtPayload;
    const words = await this.words.listSaved(userId, dto.lang, dto.targetLang);
    return { data: words.map(toResponse) };
  }

  @Post('save')
  async save(@Body() dto: SaveWordDto, @Req() req: Request) {
    const { sub: userId } = req.user as JwtPayload;
    const word = await this.words.getById(dto.id, userId);
    if (!word) throw new NotFoundException(`Word ${dto.id} not found`);
    await this.words.save(dto.id);
    return { data: { id: dto.id, saved: true } };
  }

  @Delete(':id')
  async unsave(@Param('id') id: string, @Req() req: Request) {
    const { sub: userId } = req.user as JwtPayload;
    const word = await this.words.getById(id, userId);
    if (!word) throw new NotFoundException(`Word ${id} not found`);
    await this.words.unsave(id);
    return { data: { id, saved: false } };
  }
}
