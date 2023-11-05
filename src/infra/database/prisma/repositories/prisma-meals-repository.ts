import { Meal } from '@/domain/entities/Meal';
import { IMealsRepository } from '@/domain/usecases/contracts/repositories/meals-repository';
import { PrismaService } from '../prisma.service';
import { PrismaMealsMapper } from '../mappers/prisma-meals-mapper';
import { PaginationParams } from '@/core/types/pagination-params';

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

  async findManyByUserId(userId: string, paginationParams?: PaginationParams): Promise<Meal[]> {
    const ITEMS_PER_PAGE = 1;

    const meals = paginationParams
      ? await this.prisma.meal.findMany({
          where: {
            userId,
          },
          orderBy: {
            date: 'desc',
          },
          take: ITEMS_PER_PAGE,
          skip: (paginationParams.page - 1) * ITEMS_PER_PAGE,
        })
      : await this.prisma.meal.findMany({
          where: {
            userId,
          },
          orderBy: {
            date: 'desc',
          },
        });

    return meals.map(PrismaMealsMapper.toDomain);
  }
}
