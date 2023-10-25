import { CreateMealUseCase } from '@/domain/usecases/create-meal';
import { Body, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

const createMealBodySchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  // .transform((str) => new Date(str)),
  isOnUserDiet: z.boolean(),
});

type CreateMealBodySchema = z.infer<typeof createMealBodySchema>;

@Controller('/meals')
@UseGuards(JwtAuthGuard)
export class CreateMealController {
  constructor(private createMealUseCase: CreateMealUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createMealBodySchema))
  async handle(@Body() body: CreateMealBodySchema) {
    const { userId, name, description, date, isOnUserDiet } = body;

    await this.createMealUseCase.execute({
      userId,
      name,
      description,
      date: new Date(date),
      isOnUserDiet,
    });
  }
}
