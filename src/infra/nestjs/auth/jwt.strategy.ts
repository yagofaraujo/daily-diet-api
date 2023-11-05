import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

const jwTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type JwtTokenPayload = z.infer<typeof jwTokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY');

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
