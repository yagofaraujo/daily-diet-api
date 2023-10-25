import { Module } from '@nestjs/common';
import { CreateUserController } from './http/controllers/create-user.controller';
import { CreateUserUseCase } from '../domain/usecases/create-user';
import { DatabaseModule } from './database.module';
import { CryptographyModule } from './cryptography.module';
import { AuthenticateUserController } from './http/controllers/authenticate.controller';
import { CreateMealUseCase } from '@/domain/usecases/create-meal';
import { CreateMealController } from './http/controllers/create-meal.controller';
import { FetchUserMealsUseCase } from '@/domain/usecases/fetch-user-meals';
import { FetchUserMealsController } from './http/controllers/fetch-user-meals.controller';
import { IUsersRepository } from '@/domain/usecases/contracts/repositories/users-repository';
import { IHashGenerator } from '@/domain/usecases/contracts/cryptography/hash-generator';
import { PrismaUsersRepository } from './database/prisma/repositories/prisma-users-repository';
import { BcryptHasher } from './cryptography/bcrypt-hasher';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserController, AuthenticateUserController, CreateMealController, FetchUserMealsController],
  providers: [
    // Maneira de fazer injeção de dependência sem usar @Injectable() no caso de uso (camada de domínio)
    {
      provide: CreateUserUseCase,
      useFactory: (usersRepository: IUsersRepository, hashGenerator: IHashGenerator) =>
        new CreateUserUseCase(usersRepository, hashGenerator),
      inject: [PrismaUsersRepository, BcryptHasher],
    },
    CreateMealUseCase,
    FetchUserMealsUseCase,
  ],
})
export class HttpModule {}
