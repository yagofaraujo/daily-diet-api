import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id';
import { Meal } from '@/domain/entities/Meal';
import { Meal as PrismaMeal, Prisma } from '@prisma/client';

export class PrismaMealsMapper {
  static toDomain(raw: PrismaMeal): Meal {
    return Meal.create(
      {
        userId: new UniqueEntityId(raw.userId),
        name: raw.name,
        description: raw.description,
        date: raw.date,
        isOnUserDiet: raw.isOnUserDiet,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(meal: Meal): Prisma.MealUncheckedCreateInput {
    return {
      id: meal.id.toString(),
      userId: meal.userId.toString(),
      name: meal.name,
      description: meal.description,
      date: meal.date,
      isOnUserDiet: meal.isOnUserDiet,
    };
  }
}
