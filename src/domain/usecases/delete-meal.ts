import { Either, left, right } from '@/core/either';
import { IMealsRepository } from './contracts/repositories/meals-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { NotAllowedError } from './errors/not-allowed-error';

export interface IDeleteMealRequest {
  userId: string;
  mealId: string;
}

type IDeleteMealResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteMealUseCase {
  constructor(private mealsRepository: IMealsRepository) {}

  async execute({ userId, mealId }: IDeleteMealRequest): Promise<IDeleteMealResponse> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      return left(new ResourceNotFoundError());
    }

    if (meal.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    await this.mealsRepository.delete(meal);

    return right({});
  }
}
