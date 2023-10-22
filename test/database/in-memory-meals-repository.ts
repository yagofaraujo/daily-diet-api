import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from '@/domain/usecases/ports/meals-repository';

export class InMemoryMealsRepository implements IMealsRepository {
  public items: Meal[] = [];

  async create(meal: Meal): Promise<void> {
    this.items.push(meal);
  }

  async findById(id: string): Promise<Meal | null> {
    const meal = this.items.find((meal) => meal.id.toString() === id);

    if (!meal) {
      return null;
    }

    return meal;
  }

  async findManyByUserId(userId: string): Promise<Meal[]> {
    const userMeals = this.items.filter((meal) => meal.userId.toString() === userId);

    return userMeals;
  }

  async save(meal: Meal): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === meal.id);

    this.items[itemIndex] = meal;
  }

  async delete(meal: Meal): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === meal.id);

    this.items.splice(itemIndex, 1);
  }
}
