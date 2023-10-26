import { Module } from '@nestjs/common';
import { CreateUserController } from '../http/controllers/create-user.controller';
import { CreateUserUseCase } from '../../../domain/usecases/create-user';
import { DatabaseModule } from './database.module';
import { CryptographyModule } from './cryptography.module';
import { AuthenticateUserController } from '../http/controllers/authenticate.controller';
import { CreateMealUseCase } from '@/domain/usecases/create-meal';
import { CreateMealController } from '../http/controllers/create-meal.controller';
import { FetchUserMealsUseCase } from '@/domain/usecases/fetch-user-meals';
import { FetchUserMealsController } from '../http/controllers/fetch-user-meals.controller';
import { IUsersRepository } from '@/domain/usecases/contracts/repositories/users-repository';
import { IHashGenerator } from '@/domain/usecases/contracts/cryptography/hash-generator';
import { PrismaUsersRepository } from '../../database/prisma/repositories/prisma-users-repository';
import { BcryptHasher } from '../../cryptography/bcrypt-hasher';
import { AuthenticateUserUseCase } from '@/domain/usecases/authenticate-user';
import { IHashComparer } from '@/domain/usecases/contracts/cryptography/hash-compare';
import { IEncrypter } from '@/domain/usecases/contracts/cryptography/encrypter';
import { JwtEncrypter } from '../../cryptography/jwt-encrypter';
import { IMealsRepository } from '@/domain/usecases/contracts/repositories/meals-repository';
import { PrismaMealsRepository } from '../../database/prisma/repositories/prisma-meals-repository';
import { UploadController } from '../http/controllers/upload.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateUserController,
    AuthenticateUserController,
    CreateMealController,
    FetchUserMealsController,
    UploadController,
  ],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (usersRepository: IUsersRepository, hashGenerator: IHashGenerator) =>
        new CreateUserUseCase(usersRepository, hashGenerator),
      inject: [PrismaUsersRepository, BcryptHasher],
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: (usersRepository: IUsersRepository, hashGenerator: IHashComparer, encrypter: IEncrypter) =>
        new AuthenticateUserUseCase(usersRepository, hashGenerator, encrypter),
      inject: [PrismaUsersRepository, BcryptHasher, JwtEncrypter],
    },
    {
      provide: CreateMealUseCase,
      useFactory: (mealsRepository: IMealsRepository) => new CreateMealUseCase(mealsRepository),
      inject: [PrismaMealsRepository],
    },
    {
      provide: FetchUserMealsUseCase,
      useFactory: (mealsRepository: IMealsRepository) => new FetchUserMealsUseCase(mealsRepository),
      inject: [PrismaMealsRepository],
    },
  ],
})
export class HttpModule {}
