import { Module } from '@nestjs/common';
import { CreateUserController } from './http/controllers/create-user.controller';
import { CreateUserUseCase } from '../domain/usecases/create-user';
import { DatabaseModule } from './database.module';
import { CryptographyModule } from './cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}
