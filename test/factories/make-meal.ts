import { UniqueEntityId } from '@/domain/core/entities/value-objects/unique-entity-id';
import { Meal, MealProps } from '@/domain/entities/Meal';

export function makeMeal(override: Partial<MealProps> = {}, id?: UniqueEntityId) {
  const meal = Meal.create(
    {
      userId: new UniqueEntityId(),
      name: 'Fake Meal',
      description: 'fake description',
      date: new Date(),
      isOnUserDiet: true,
      ...override,
    },
    id,
  );

  return meal;
}
