import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PrismaUsersRepository } from '../../database/prisma/repositories/prisma-users-repository';
import { PrismaMealsRepository } from '../../database/prisma/repositories/prisma-meals-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: PrismaUsersRepository,
      useFactory: (prisma: PrismaService) => new PrismaUsersRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaMealsRepository,
      useFactory: (prisma: PrismaService) => new PrismaMealsRepository(prisma),
      inject: [PrismaService],
    },
  ],
  exports: [PrismaService, PrismaUsersRepository, PrismaMealsRepository],
})
export class DatabaseModule {}
