import { Meal } from '@/domain/entities/Meal';

export interface IMealsRepository {
  create(meal: Meal): Promise<void>;
  findById(id: string): Promise<Meal | null>;
  save(meal: Meal): Promise<void>;
  delete(meal: Meal): Promise<void>;
  findManyByUserId(userId: string): Promise<Meal[]>;
}
