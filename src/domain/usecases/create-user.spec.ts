import { InMemoryUsersRepository } from '@/test/database/in-memory-users-repository';
import { CreateUserUseCase, ICreateUserRequest } from './create-user';
import { FakeHasher } from '@/test/cryptography/fake-hasher';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: CreateUserUseCase;

describe('Create User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should be able to create a new user', async () => {
    const mockExecuteCreateNewUserUseCase = vi.spyOn(sut, 'execute');

    const useCasePayload: ICreateUserRequest = {
      name: 'Test',
      email: 'testuser@email.com',
      password: '123456',
    };

    const result = await sut.execute(useCasePayload);

    expect(mockExecuteCreateNewUserUseCase).toHaveBeenCalledTimes(1);
    expect(mockExecuteCreateNewUserUseCase).toHaveBeenCalledWith(useCasePayload);

    expect(result.isRight()).toBeTruthy();

    if (result.isRight()) {
      expect(result.value?.user).toEqual(inMemoryUsersRepository.items[0]);
    }
  });

  it('Should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });
});
