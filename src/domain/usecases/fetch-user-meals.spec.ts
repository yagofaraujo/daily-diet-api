import { InMemoryMealsRepository } from '@/test/database/in-memory-meals-repository';
import { FetchUserMealsUseCase, IFetchUserMealsRequest } from './fetch-user-meals';
import { makeUser } from '@/test/factories/make-user';
import { makeMeal } from '@/test/factories/make-meal';
let inMemoryMealsRepository: InMemoryMealsRepository;
let sut: FetchUserMealsUseCase;

describe('Fetch User Meals Use Case', () => {
  beforeEach(() => {
    inMemoryMealsRepository = new InMemoryMealsRepository();
    sut = new FetchUserMealsUseCase(inMemoryMealsRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to fetch user meals', async () => {
    const mockExecuteFetchUserMealsUseCase = vi.spyOn(sut, 'execute');
    const fakeUser = makeUser();
    const fakeMeal1 = makeMeal({
      userId: fakeUser.id,
    });
    const fakeMeal2 = makeMeal({
      userId: fakeUser.id,
    });
    const fakeMeal3 = makeMeal({
      userId: fakeUser.id,
    });
    inMemoryMealsRepository.create(fakeMeal1);
    inMemoryMealsRepository.create(fakeMeal2);
    inMemoryMealsRepository.create(fakeMeal3);

    const fakeAnotherUser = makeUser();
    const fakeMealFromAnotherUser = makeMeal({
      userId: fakeAnotherUser.id,
    });
    inMemoryMealsRepository.create(fakeMealFromAnotherUser);

    const useCasePayload: IFetchUserMealsRequest = {
      userId: fakeUser.id.toString(),
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteFetchUserMealsUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteFetchUserMealsUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value.meals.length).toEqual(3);
      expect(result.value.meals).toMatchObject([
        {
          userId: fakeUser.id,
        },
        {
          userId: fakeUser.id,
        },
        {
          userId: fakeUser.id,
        },
      ]);
    }
  });
});
