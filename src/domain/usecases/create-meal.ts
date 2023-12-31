import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id';
import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from './contracts/repositories/meals-repository';

export interface ICreateMealRequest {
  userId: string;
  name: string;
  description: string;
  date: Date;
  isOnUserDiet: boolean;
}

type ICreateMealResponse = Either<
  null,
  {
    meal: Meal;
  }
>;

export class CreateMealUseCase {
  constructor(private mealsRepository: IMealsRepository) {}

  async execute({ userId, name, description, date, isOnUserDiet }: ICreateMealRequest): Promise<ICreateMealResponse> {
    const meal = Meal.create({
      userId: new UniqueEntityId(userId),
      name,
      description,
      date,
      isOnUserDiet,
    });

    await this.mealsRepository.create(meal);

    return right({
      meal,
    });
  }
}
