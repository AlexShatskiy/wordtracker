import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { ListWordsDto, SaveWordDto } from './dto/words.dto';

@Controller('words')
export class WordsController {
  constructor(private readonly words: WordsService) {}

  @Get()
  list(@Query() dto: ListWordsDto) {
    return { data: this.words.listSaved(dto.lang, dto.targetLang) };
  }

  @Post('save')
  save(@Body() dto: SaveWordDto) {
    const word = this.words.getById(dto.id);
    if (!word) throw new NotFoundException(`Word ${dto.id} not found`);
    this.words.save(dto.id);
    return { data: { id: dto.id, saved: true } };
  }

  @Delete(':id')
  unsave(@Param('id') id: string) {
    const word = this.words.getById(id);
    if (!word) throw new NotFoundException(`Word ${id} not found`);
    this.words.unsave(id);
    return { data: { id, saved: false } };
  }
}
