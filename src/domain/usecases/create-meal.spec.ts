import { InMemoryMealsRepository } from '@/adapters/database/in-memory-meals-repository';
import { CreateMealUseCase, ICreateMealRequest } from './create-meal';
import { makeUser } from '@/test/factories/make-user';

let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: CreateMealUseCase;

describe('Create Meal Use Case', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new CreateMealUseCase(inMemoryMealsRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to create a new meal', async () => {
    const mockExecuteCreateNewMealUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();

    const useCasePayload: ICreateMealRequest = {
      userId: fakeUser.id.toString(),
      name: 'Test Meal',
      description: 'Testing meal',
      date: new Date('2023-01-30'),
      isOnUserDiet: true,
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteCreateNewMealUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteCreateNewMealUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.meal).toEqual(inMemoryMealsRepository.items[0]);
  });
});
