import { InMemoryMealsRepository } from '@/adapters/database/in-memory-meals-repository';
import { GetUserMetricsUseCase, IGetUserMetricsRequest } from './get-user-metrics';
import { makeUser } from '@/test/factories/make-user';
import { makeMeal } from '@/test/factories/make-meal';
let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new GetUserMetricsUseCase(inMemoryMealsRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to get user metrics', async () => {
    const mockExecuteGetUserMetricsUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-05'),
        isOnUserDiet: true,
      }),
    );
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-06'),
        isOnUserDiet: false,
      }),
    );
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-07'),
        isOnUserDiet: true,
      }),
    );
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-08'),
        isOnUserDiet: true,
      }),
    );
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-09'),
        isOnUserDiet: true,
      }),
    );
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-10'),
        isOnUserDiet: false,
      }),
    );
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-11'),
        isOnUserDiet: false,
      }),
    );
    inMemoryMealsRepository.create(
      makeMeal({
        userId: fakeUser.id,
        date: new Date('2023-01-12'),
        isOnUserDiet: true,
      }),
    );

    const useCasePayload: IGetUserMetricsRequest = {
      userId: fakeUser.id.toString(),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteGetUserMetricsUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteGetUserMetricsUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.userMetrics).toMatchObject({
        mealsTotal: 8,
        mealsOnDietTotal: 5,
        mealsOutDietTotal: 3,
        mealsOnDietBestSequence: 3,
      });
    }
  });
});
