import { Either, right } from '@/domain/core/either';
import { IMealsRepository } from './ports/meals-repository';
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { Meal } from '../entities/Meal';

export interface IGetUserMetricsRequest {
  userId: string;
}

type IGetUserMetricsResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    userMetrics: {
      mealsTotal: number;
      mealsOnDietTotal: number;
      mealsOutDietTotal: number;
    };
  }
>;

export class GetUserMetricsUseCase {
  private userMeals: Meal[] = [];

  constructor(private mealsRepository: IMealsRepository) {}

  private calculateMealsOnDietTotal() {
    return this.userMeals.filter((meal) => meal.isOnUserDiet === true).length;
  }

  private calculateMealsOnDietBestSequence() {
    let mealsOnDietBestSequence = 0;

    const userMealsOrderByDate = this.userMeals.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateA > dateB ? 1 : -1;
    });

    userMealsOrderByDate.reduce((acc, currentValue) => {
      if (currentValue.isOnUserDiet) {
        return acc + 1;
      }

      if (mealsOnDietBestSequence < acc) {
        mealsOnDietBestSequence = acc;
      }

      return 0;
    }, 0);

    return mealsOnDietBestSequence;
  }

  async execute({ userId }: IGetUserMetricsRequest): Promise<IGetUserMetricsResponse> {
    this.userMeals = await this.mealsRepository.findManyByUserId(userId);

    const mealsTotal = this.userMeals.length;
    const mealsOnDietTotal = this.calculateMealsOnDietTotal();
    const mealsOutDietTotal = mealsTotal - mealsOnDietTotal;
    const mealsOnDietBestSequence = this.calculateMealsOnDietBestSequence();

    return right({
      userMetrics: {
        mealsTotal,
        mealsOnDietTotal,
        mealsOutDietTotal,
        mealsOnDietBestSequence,
      },
    });
  }
}
