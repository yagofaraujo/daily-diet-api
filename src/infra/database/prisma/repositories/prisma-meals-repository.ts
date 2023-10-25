import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from '@/domain/usecases/ports/meals-repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaMealsMapper } from '../mappers/prisma-meals-mapper';

@Injectable()
export class PrismaMealsRepository implements IMealsRepository {
  constructor(private prisma: PrismaService) {}

  async create(meal: Meal): Promise<void> {
    const data = PrismaMealsMapper.toPrisma(meal);

    await this.prisma.meal.create({
      data,
    });
  }

  async save(meal: Meal): Promise<void> {
    const data = PrismaMealsMapper.toPrisma(meal);

    await this.prisma.meal.update({
      where: {
        id: meal.id.toString(),
      },
      data,
    });
  }

  async delete(meal: Meal): Promise<void> {
    await this.prisma.meal.delete({
      where: {
        id: meal.id.toString(),
      },
    });
  }

  async findById(id: string): Promise<Meal | null> {
    const meal = await this.prisma.meal.findUnique({
      where: {
        id,
      },
    });

    if (!meal) {
      return null;
    }

    return PrismaMealsMapper.toDomain(meal);
  }

  async findManyByUserId(userId: string): Promise<Meal[]> {
    const meals = await this.prisma.meal.findMany({
      where: {
        userId,
      },
    });

    return meals.map(PrismaMealsMapper.toDomain);
  }
}
