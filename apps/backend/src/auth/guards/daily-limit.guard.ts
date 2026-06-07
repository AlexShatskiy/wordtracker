import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtPayload } from '../strategies/jwt.strategy';

type DailyEntry = { count: number; date: string };

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class DailyLimitGuard implements CanActivate {
  private readonly limit: number;
  private readonly store = new Map<string, DailyEntry>();

  constructor(config: ConfigService) {
    this.limit = config.get<number>('DAILY_TRANSLATE_LIMIT', 10);
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const user = req.user as JwtPayload;
    const userId = user.sub;
    const today = todayUtc();

    const entry = this.store.get(userId);
    const current = entry?.date === today ? entry.count : 0;

    res.setHeader('X-Daily-Limit', this.limit);
    res.setHeader(
      'X-Daily-Limit-Remaining',
      Math.max(0, this.limit - current - 1),
    );

    if (current >= this.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Daily translation limit reached (${this.limit}/day). Resets at midnight UTC.`,
          limit: this.limit,
          remaining: 0,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.store.set(userId, { count: current + 1, date: today });
    return true;
  }
}
