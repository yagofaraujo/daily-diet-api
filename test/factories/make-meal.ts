import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id';
import { Meal, MealProps } from '@/domain/entities/Meal';

export function makeMeal(override: Partial<MealProps> = {}, id?: UniqueEntityId) {
  const meal = Meal.create(
    {
      userId: new UniqueEntityId(),
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      date: new Date(),
      isOnUserDiet: true,
      ...override,
    },
    id,
  );

  return meal;
}
