import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AuthenticateUserUseCase } from '@/domain/usecases/authenticate-user';
import { WrongCredentialsError } from '@/domain/usecases/errors/wrong-credentials-error';
import { PublicRoute } from '@/infra/nestjs/auth/public-route-decorator';

const authenticateUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Controller('/auth')
@PublicRoute()
export class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  @Get()
  async test() {
    return 'Hello World!';
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  async handle(@Body() body: AuthenticateUserBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUserUseCase.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new InternalServerErrorException('Unexpected Error');
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
