import { Injectable } from '@nestjs/common';
import { Translation, Word } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Lang } from '../lang';

export type WordWithTranslation = Word & { translation: Translation };

@Injectable()
export class WordsService {
  constructor(private readonly prisma: PrismaService) {}

  private wordId(userId: string, translationId: string): string {
    return `${userId}:${translationId}`;
  }

  async recordLookup(translationId: string, userId: string): Promise<Word> {
    const id = this.wordId(userId, translationId);
    return await this.prisma.word.upsert({
      where: { id },
      create: { id, userId, translationId },
      update: { lookups: { increment: 1 }, lastSeenAt: new Date() },
    });
  }

  async save(id: string, userId: string): Promise<void> {
    await this.prisma.word.update({ where: { id, userId }, data: { saved: true } });
  }

  async unsave(id: string, userId: string): Promise<void> {
    await this.prisma.word.update({ where: { id, userId }, data: { saved: false } });
  }

  async listSaved(
    userId: string,
    lang?: Lang,
    targetLang?: Lang,
  ): Promise<WordWithTranslation[]> {
    return await this.prisma.word.findMany({
      where: {
        userId,
        saved: true,
        ...(lang || targetLang
          ? {
              translation: {
                ...(lang ? { lang } : {}),
                ...(targetLang ? { targetLang } : {}),
              },
            }
          : {}),
      },
      include: { translation: true },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  async getById(
    id: string,
    userId: string,
  ): Promise<WordWithTranslation | null> {
    return await this.prisma.word.findFirst({
      where: { id, userId },
      include: { translation: true },
    });
  }
}
