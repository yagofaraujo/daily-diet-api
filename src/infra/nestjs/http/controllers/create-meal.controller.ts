import { CreateMealUseCase } from '@/domain/usecases/create-meal';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/nestjs/auth/current-user-decorator';
import { JwtTokenPayload } from '@/infra/nestjs/auth/jwt.strategy';

const createMealBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  isOnUserDiet: z.boolean(),
});

type CreateMealBodySchema = z.infer<typeof createMealBodySchema>;

@Controller('/meals')
/* MIDDLEWARE DE AUTENTICAÇÃO:
  (por padrão, todas as rotas da aplicação precisa de autenticação,
  com exceção das que usam o decorator "PublicRoute()")
@UseGuards(JwtAuthGuard) */
export class CreateMealController {
  constructor(private createMealUseCase: CreateMealUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createMealBodySchema)) body: CreateMealBodySchema,
    @CurrentUser() user: JwtTokenPayload,
  ) {
    const { name, description, date, isOnUserDiet } = body;

    await this.createMealUseCase.execute({
      userId: user.sub,
      name,
      description,
      date: new Date(date),
      isOnUserDiet,
    });
  }
}
