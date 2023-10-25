import { Meal } from '@/domain/entities/Meal';

export abstract class IMealsRepository {
  abstract create(meal: Meal): Promise<void>;
  abstract findById(id: string): Promise<Meal | null>;
  abstract save(meal: Meal): Promise<void>;
  abstract delete(meal: Meal): Promise<void>;
  abstract findManyByUserId(userId: string): Promise<Meal[]>;
}
