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
import { PrismaService } from '../../prisma/prisma.service';

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class DailyLimitGuard implements CanActivate {
  private readonly limit: number;

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.limit = config.get<number>('DAILY_TRANSLATE_LIMIT', 10);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { sub: userId } = req.user as JwtPayload;
    const today = todayUtc();

    const existing = await this.prisma.dailyUsage.findUnique({
      where: { userId_date: { userId, date: today } },
    });
    const current = existing?.count ?? 0;

    res.setHeader('X-Daily-Limit', this.limit);
    res.setHeader('X-Daily-Limit-Remaining', Math.max(0, this.limit - current - 1));

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

    await this.prisma.dailyUsage.upsert({
      where: { userId_date: { userId, date: today } },
      create: { userId, date: today, count: 1 },
      update: { count: { increment: 1 } },
    });

    return true;
  }
}
