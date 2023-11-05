import { Either, left, right } from '@/core/either';
import { User } from '@/domain/entities/User';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { IHashGenerator } from './contracts/cryptography/hash-generator';
import { IUsersRepository } from './contracts/repositories/users-repository';

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
}

type ICreateUserResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hashGenerator: IHashGenerator,
  ) {}

  async execute({ name, email, password }: ICreateUserRequest): Promise<ICreateUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
