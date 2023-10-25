import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma/prisma.service';
import { PrismaUsersRepository } from './database/prisma/repositories/prisma-users-repository';
import { IUsersRepository } from '@/domain/usecases/ports/users-repository';
import { IMealsRepository } from '@/domain/usecases/ports/meals-repository';
import { PrismaMealsRepository } from './database/prisma/repositories/prisma-meals-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: IMealsRepository,
      useClass: PrismaMealsRepository,
    },
  ],
  exports: [PrismaService, IUsersRepository, IMealsRepository],
})
export class DatabaseModule {}
