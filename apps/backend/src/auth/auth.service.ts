import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleProfile } from './strategies/google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signIn(profile: GoogleProfile): Promise<string> {
    await this.prisma.user.upsert({
      where: { id: profile.id },
      create: { id: profile.id, email: profile.email, name: profile.name },
      update: { email: profile.email, name: profile.name },
    });

    return this.jwt.sign({ sub: profile.id, email: profile.email });
  }
}
