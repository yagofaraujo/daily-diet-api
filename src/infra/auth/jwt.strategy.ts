import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { Env } from '../env';
import { Injectable } from '@nestjs/common';

const jwTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type JwtTokenPayload = z.infer<typeof jwTokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtTokenPayload) {
    return jwTokenPayloadSchema.parse(payload);
  }
}
