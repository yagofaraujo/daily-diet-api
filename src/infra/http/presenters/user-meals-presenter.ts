import { Meal } from '@/domain/entities/Meal';

export class UserMealsPresenter {
  static toHTTP({ id, name, description, date, isOnUserDiet, createdAt, updatedAt }: Meal) {
    return {
      id: id.toString(),
      name,
      description,
      date,
      isOnUserDiet,
      createdAt,
      updatedAt,
    };
  }
}
