import { Either, left, right } from '@/core/either';
import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from './ports/meals-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

export interface IGetMealByIdRequest {
  userId: string;
  mealId: string;
}

type IGetMealByIdResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    meal: Meal;
  }
>;

export class GetMealByIdUseCase {
  constructor(private mealsRepository: IMealsRepository) {}

  async execute({ userId, mealId }: IGetMealByIdRequest): Promise<IGetMealByIdResponse> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      return left(new ResourceNotFoundError());
    }

    if (meal.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    return right({
      meal,
    });
  }
}
