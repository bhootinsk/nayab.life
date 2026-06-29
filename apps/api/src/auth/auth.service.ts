import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { AuthResponse } from '@nayab/shared';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  login(username: string, password: string): AuthResponse {
    const creds = this.getCredentials();
    if (username.trim() !== creds.username || password.trim() !== creds.password) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { sub: creds.username };
    return {
      accessToken: this.jwt.sign(payload),
      username: creds.username,
    };
  }

  private getCredentials(): { username: string; password: string } {
    const envUser = this.config.get<string>('ADMIN_USERNAME')?.trim();
    const envPass = this.config.get<string>('ADMIN_PASSWORD')?.trim();
    if (envUser && envPass) return { username: envUser, password: envPass };

    const root = path.resolve(this.config.get<string>('CONTENT_ROOT') || path.join(process.cwd(), '../..'));
    try {
      const file = JSON.parse(fs.readFileSync(path.join(root, 'data', 'admin.json'), 'utf8'));
      if (file.username && file.password) return file;
    } catch {
      /* defaults */
    }
    return { username: 'nayab_admin', password: 'NayabLife2025!' };
  }
}
