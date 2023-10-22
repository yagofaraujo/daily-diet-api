import { Either, right } from '@/domain/core/either';
import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from './ports/meals-repository';

export interface IFetchUserMealsRequest {
  userId: string;
}

type IFetchUserMealsResponse = Either<
  null,
  {
    meals: Meal[];
  }
>;

export class FetchUserMealsUseCase {
  constructor(private mealsRepository: IMealsRepository) {}

  async execute({ userId }: IFetchUserMealsRequest): Promise<IFetchUserMealsResponse> {
    const userMeals = await this.mealsRepository.findManyByUserId(userId);

    return right({
      meals: userMeals,
    });
  }
}
