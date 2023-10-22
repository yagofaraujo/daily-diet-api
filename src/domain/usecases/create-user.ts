import { Either, right } from '@/domain/core/either';
import { User } from '@/domain/entities/User';
import { IUsersRepository } from './ports/users-repository';

export interface ICreateUserRequest {
  name: string;
  email: string;
}

type ICreateUserResponse = Either<
  null,
  {
    user: User;
  }
>;

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email }: ICreateUserRequest): Promise<ICreateUserResponse> {
    const user = User.create({
      name,
      email,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
