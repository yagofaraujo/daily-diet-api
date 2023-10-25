import { FetchUserMealsUseCase } from '@/domain/usecases/fetch-user-meals';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { JwtTokenPayload } from '@/infra/auth/jwt.strategy';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z } from 'zod';
import { DEFAULT_PAGE } from '@/core/types/pagination-params';

// const pageQueryParamsSchema = z.string().optional().transform(Number).pipe(z.number().min(DEFAULT_PAGE).optional());
const pageQueryParamsSchema = z.optional(
  z.string().optional().transform(Number).pipe(z.number().default(DEFAULT_PAGE)),
);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/meals')
@UseGuards(JwtAuthGuard)
export class FetchUserMealsController {
  constructor(private fetchUserMealsUseCase: FetchUserMealsUseCase) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamsSchema)) page: PageQueryParamsSchema,
    @CurrentUser() user: JwtTokenPayload,
  ) {
    const result = await this.fetchUserMealsUseCase.execute({
      userId: user.sub,
      paginationParams: page ? { page } : undefined,
    });

    const meals = result.value?.meals;

    return { meals };
  }
}
