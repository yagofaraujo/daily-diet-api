import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Controller('/auth')
export class AuthenticateUserController {
  constructor(private jwtService: JwtService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  async handle(@Body() body: AuthenticateUserBodySchema) {
    const { email, password } = body;

    const acessToken = this.jwtService.sign({ sub: 'user-id' });

    return {
      acess_token: acessToken,
    };
  }
}
