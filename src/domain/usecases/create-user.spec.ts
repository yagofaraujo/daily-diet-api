import { InMemoryUsersRepository } from '@/adapters/database/in-memory-users-repository';
import { CreateUserUseCase, ICreateUserRequest } from './create-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe('Create User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(inMemoryUsersRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to create a new user', async () => {
    const mockExecuteCreateNewUserUseCase = vi.spyOn(sut, 'execute');

    const useCasePayload: ICreateUserRequest = {
      name: 'Test',
      email: 'testuser@email.com',
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteCreateNewUserUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteCreateNewUserUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.user).toEqual(inMemoryUsersRepository.items[0]);
  });
});
