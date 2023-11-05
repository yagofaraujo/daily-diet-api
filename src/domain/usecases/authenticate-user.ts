import { Either, left, right } from '@/core/either';
import { IUsersRepository } from './contracts/repositories/users-repository';
import { IHashComparer } from './contracts/cryptography/hash-compare';
import { IEncrypter } from './contracts/cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

export interface IAuthenticateUserRequest {
  email: string;
  password: string;
}

type IAuthenticateUserResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hashGenerator: IHashComparer,
    private encrypter: IEncrypter,
  ) {}

  async execute({ email, password }: IAuthenticateUserRequest): Promise<IAuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isValidPassword = await this.hashGenerator.compare(password, user.password);

    if (!isValidPassword) {
      throw new WrongCredentialsError();
    }

    const accessToken = await this.encrypter.encrypt({ sub: user.id.toString() });

    return right({
      accessToken,
    });
  }
}
