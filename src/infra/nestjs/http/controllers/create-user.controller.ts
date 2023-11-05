import { CreateUserUseCase } from '@/domain/usecases/create-user';
import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { UserAlreadyExistsError } from '@/domain/usecases/errors/user-already-exists-error';
import { PublicRoute } from '@/infra/nestjs/auth/public-route-decorator';

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

@Controller('/users')
@PublicRoute()
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(new ZodValidationPipe(createUserBodySchema)) body: CreateUserBodySchema) {
    const { name, email, password } = createUserBodySchema.parse(body);

    const result = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new InternalServerErrorException('Unexpected Error');
      }
    }
  }
}
