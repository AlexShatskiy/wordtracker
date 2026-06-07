import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';
import { TranslationClient } from './translation-client';
import { DailyLimitGuard } from '../auth/guards/daily-limit.guard';
import { WordsModule } from '../words/words.module';

@Module({
  imports: [WordsModule],
  controllers: [TranslateController],
  providers: [TranslateService, TranslationClient, DailyLimitGuard],
})
export class TranslateModule {}
