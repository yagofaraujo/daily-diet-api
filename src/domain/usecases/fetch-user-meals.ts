import { Either, right } from '@/core/either';
import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from './contracts/repositories/meals-repository';
import { PaginationParams } from '@/core/types/pagination-params';

export interface IFetchUserMealsRequest {
  userId: string;
  paginationParams?: PaginationParams;
}

type IFetchUserMealsResponse = Either<
  null,
  {
    meals: Meal[];
  }
>;

export class FetchUserMealsUseCase {
  constructor(private mealsRepository: IMealsRepository) {}

  async execute({ userId, paginationParams }: IFetchUserMealsRequest): Promise<IFetchUserMealsResponse> {
    const userMeals = await this.mealsRepository.findManyByUserId(userId, paginationParams);

    return right({
      meals: userMeals,
    });
  }
}
