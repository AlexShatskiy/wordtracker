import { Controller, Get, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleProfile } from './strategies/google.strategy';
import { JwtPayload } from './strategies/jwt.strategy';

const COOKIE_NAME = 'wt-token';
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60 * 1000; // 90 days

@Controller('auth')
export class AuthController {
  private readonly frontendUrl: string;
  private readonly isProd: boolean;

  constructor(
    private readonly auth: AuthService,
    config: ConfigService,
  ) {
    this.frontendUrl = config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    this.isProd = config.get<string>('NODE_ENV') === 'production';
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport redirects to Google — no body needed
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const token = await this.auth.signIn(req.user as GoogleProfile);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    res.redirect(this.frontendUrl);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const { sub, email } = req.user as JwtPayload;
    const user = await this.auth.findUser(sub);
    if (!user) throw new UnauthorizedException();
    return { id: sub, email, name: user.name };
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return { ok: true };
  }
}
