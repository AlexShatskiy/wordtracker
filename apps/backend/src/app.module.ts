import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TranslateModule } from './translate/translate.module';

@Module({
  imports: [TranslateModule],
  controllers: [AppController],
})
export class AppModule {}
