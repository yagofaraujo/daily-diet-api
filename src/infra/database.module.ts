import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma/prisma.service';
import { PrismaUsersRepository } from './database/prisma/repositories/prisma-users-repository';
import { IMealsRepository } from '@/domain/usecases/ports/meals-repository';
import { PrismaMealsRepository } from './database/prisma/repositories/prisma-meals-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PrismaUsersRepository,
      useFactory: (prisma: PrismaService) => new PrismaUsersRepository(prisma),
      inject: [PrismaService],
    },
    // Outra forma de fazer injeção de dependência -> transformando a interface em uma classe abstrata
    // Desta forma, o prisma consegue se organizar internamente para injetar as dependências que são necessárias
    {
      provide: IMealsRepository,
      useClass: PrismaMealsRepository,
    },
  ],
  exports: [PrismaService, PrismaUsersRepository, IMealsRepository],
})
export class DatabaseModule {}
