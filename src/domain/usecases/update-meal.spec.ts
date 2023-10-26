import { InMemoryMealsRepository } from '@/test/database/in-memory-meals-repository';
import { UpdateMealUseCase, IUpdateMealRequest } from './update-meal';
import { makeUser } from '@/test/factories/make-user';
import { makeMeal } from '@/test/factories/make-meal';
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id';
import { NotAllowedError } from '@/domain/usecases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/usecases/errors/resource-not-found-error';

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: UpdateMealUseCase;

describe('Update Meal Use Case', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new UpdateMealUseCase(inMemoryMealsRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to edit a meal', async () => {
    const mockExecuteUpdateMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: fakeUser.id,
    });

    inMemoryMealsRepository.create(fakeMeal);

    const useCasePayload: IUpdateMealRequest = {
      userId: fakeUser.id.toString(),
      mealId: fakeMeal.id.toString(),
      name: 'Updated Meal',
      description: 'Updated meal description',
      date: new Date('2023-03-30'),
      isOnUserDiet: false,
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();

    expect(inMemoryMealsRepository.items[0]).toMatchObject({
      name: 'Updated Meal',
      description: 'Updated meal description',
      date: new Date('2023-03-30'),
      isOnUserDiet: false,
    });
  });

  it('should not be able to edit a nonexistent meal', async () => {
    const mockExecuteUpdateMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: fakeUser.id,
    });

    inMemoryMealsRepository.create(fakeMeal);

    const useCasePayload: IUpdateMealRequest = {
      userId: fakeUser.id.toString(),
      mealId: 'random_meal_id',
      name: 'Updated Meal',
      description: 'Updated meal description',
      date: new Date('2023-03-30'),
      isOnUserDiet: false,
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

    const useCasePayload: IUpdateMealRequest = {
      userId: fakeUser.id.toString(),
      mealId: fakeMeal.id.toString(),
      name: 'Updated Meal',
      description: 'Updated meal description',
      date: new Date('2023-03-30'),
      isOnUserDiet: false,
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteUpdateMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
