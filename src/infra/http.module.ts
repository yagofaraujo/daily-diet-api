import { Module } from '@nestjs/common';
import { CreateUserController } from './http/controllers/create-user.controller';
import { CreateUserUseCase } from '../domain/usecases/create-user';
import { DatabaseModule } from './database.module';
import { CryptographyModule } from './cryptography.module';
import { AuthenticateUserController } from './http/controllers/authenticate.controller';
import { CreateMealUseCase } from '@/domain/usecases/create-meal';
import { CreateMealController } from './http/controllers/create-meal.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserController, AuthenticateUserController, CreateMealController],
  providers: [CreateUserUseCase, CreateMealUseCase],
})
export class HttpModule {}
