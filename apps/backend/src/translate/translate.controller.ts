import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DailyLimitGuard } from '../auth/guards/daily-limit.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { TranslateService } from './translate.service';
import { TranslateDto } from './dto/translate.dto';

@Controller('translate')
@UseGuards(JwtAuthGuard)
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @UseGuards(DailyLimitGuard)
  @Post()
  async translate(@Body() dto: TranslateDto, @Req() req: Request) {
    const { sub: userId } = req.user as JwtPayload;
    return this.translateService.translate(dto, userId);
  }
}
