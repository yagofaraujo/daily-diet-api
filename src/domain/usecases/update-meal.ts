import { Either, left, right } from '@/domain/core/either';
import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from './ports/meals-repository';
import { ResourceNotFoundError } from '../core/errors/resource-not-found-error';
import { NotAllowedError } from '../core/errors/not-allowed-error';

export interface IUpdateMealRequest {
  userId: string;
  mealId: string;
  name: string;
  description: string;
  date: Date;
  isOnUserDiet: boolean;
}

type IUpdateMealResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    meal: Meal;
  }
>;

export class UpdateMealUseCase {
  constructor(private mealsRepository: IMealsRepository) {}

  updateMealFields(
    meal: Meal,
    fieldsToUpdate: Pick<IUpdateMealRequest, 'name' | 'description' | 'date' | 'isOnUserDiet'>,
  ): Meal {
    const updatedMeal = meal;
    updatedMeal.name = fieldsToUpdate.name;
    updatedMeal.description = fieldsToUpdate.description;
    updatedMeal.date = fieldsToUpdate.date;
    updatedMeal.isOnUserDiet = fieldsToUpdate.isOnUserDiet;

    return updatedMeal;
  }

  async execute({
    userId,
    mealId,
    name,
    description,
    date,
    isOnUserDiet,
  }: IUpdateMealRequest): Promise<IUpdateMealResponse> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      return left(new ResourceNotFoundError());
    }

    if (meal.userId.toString() !== userId) {
      return left(new NotAllowedError());
    }

    const updatedMeal = this.updateMealFields(meal, {
      name,
      description,
      date,
      isOnUserDiet,
    });

    await this.mealsRepository.save(updatedMeal);

    return right({
      meal,
    });
  }
}
