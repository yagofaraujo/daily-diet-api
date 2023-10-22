import { InMemoryMealsRepository } from '@/test/database/in-memory-meals-repository';
import { GetMealByIdUseCase, IGetMealByIdRequest } from './get-meal-by-id';
import { makeUser } from '@/test/factories/make-user';
import { makeMeal } from '@/test/factories/make-meal';
import { ResourceNotFoundError } from '../core/errors/resource-not-found-error';
import { UniqueEntityId } from '../core/entities/value-objects/unique-entity-id';
import { NotAllowedError } from '../core/errors/not-allowed-error';
let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: GetMealByIdUseCase;

describe('Get Meal by ID Use Case', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new GetMealByIdUseCase(inMemoryMealsRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to get meal', async () => {
    const mockExecuteGetMealByIdUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: fakeUser.id,
      name: 'Get Meal By ID test',
      description: 'Get Meal By ID test',
    });
    inMemoryMealsRepository.create(fakeMeal);

    const fakeAnotherUser = makeUser();
    const fakeMealFromAnotherUser = makeMeal({
      userId: fakeAnotherUser.id,
    });
    inMemoryMealsRepository.create(fakeMealFromAnotherUser);

    const useCasePayload: IGetMealByIdRequest = {
      userId: fakeUser.id.toString(),
      mealId: fakeMeal.id.toString(),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteGetMealByIdUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteGetMealByIdUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.meal).toMatchObject({
        id: fakeMeal.id,
        name: 'Get Meal By ID test',
        description: 'Get Meal By ID test',
      });
    }
  });

  it('should not be able to get a nonexistent meal', async () => {
    const mockExecuteUpdateMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: fakeUser.id,
    });

    inMemoryMealsRepository.create(fakeMeal);

    const useCasePayload: IGetMealByIdRequest = {
      userId: fakeUser.id.toString(),
      mealId: 'random_meal_id',
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a meal from another user', async () => {
    const mockExecuteUpdateMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: new UniqueEntityId('user-01'),
    });

    inMemoryMealsRepository.create(fakeMeal);

    const useCasePayload: IGetMealByIdRequest = {
      userId: fakeUser.id.toString(),
      mealId: fakeMeal.id.toString(),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
