import { Either, left, right } from '@/core/either';
import { User } from '@/domain/entities/User';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';
import { IHashGenerator } from './contracts/cryptography/hash-generator';
import { IUsersRepository } from './contracts/repositories/users-repository';

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
}

type ICreateUserResponse = Either<
  StudentAlreadyExistsError,
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
    const studentWithSameEmail = await this.usersRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
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
