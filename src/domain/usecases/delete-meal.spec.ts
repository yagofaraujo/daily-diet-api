import { InMemoryMealsRepository } from '@/adapters/database/in-memory-meals-repository';
import { DeleteMealUseCase, IDeleteMealRequest } from './delete-meal';
import { makeUser } from '@/test/factories/make-user';
import { makeMeal } from '@/test/factories/make-meal';
import { UniqueEntityId } from '@/domain/core/entities/value-objects/unique-entity-id';
import { NotAllowedError } from '@/domain/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error';

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: DeleteMealUseCase;

describe('Delete Meal Use Case', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new DeleteMealUseCase(inMemoryMealsRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to delete a meal', async () => {
    const mockExecuteDeleteMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: fakeUser.id,
    });

    inMemoryMealsRepository.create(fakeMeal);

    const useCasePayload: IDeleteMealRequest = {
      userId: fakeUser.id.toString(),
      mealId: fakeMeal.id.toString(),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteDeleteMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteDeleteMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight());

    expect(result.value).toMatchObject({});

    expect(inMemoryMealsRepository.items.length).toEqual(0);
  });

  it('should not be able to delete a nonexistent meal', async () => {
    const mockExecuteDeleteMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: fakeUser.id,
    });

    inMemoryMealsRepository.create(fakeMeal);

    const useCasePayload: IDeleteMealRequest = {
      userId: fakeUser.id.toString(),
      mealId: 'random_meal_id',
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteDeleteMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteDeleteMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete a meal from another user', async () => {
    const mockExecuteDeleteMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal = makeMeal({
      userId: new UniqueEntityId('user-01'),
    });

    inMemoryMealsRepository.create(fakeMeal);

    const useCasePayload: IDeleteMealRequest = {
      userId: fakeUser.id.toString(),
      mealId: fakeMeal.id.toString(),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteDeleteMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteDeleteMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isLeft()).toBeTruthy();

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
