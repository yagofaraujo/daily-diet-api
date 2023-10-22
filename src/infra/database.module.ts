import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma/prisma.service';
import { PrismaUsersRepository } from './database/prisma/repositories/prisma-users-repository';
import { IUsersRepository } from '@/domain/usecases/ports/users-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [PrismaService, IUsersRepository],
})
export class DatabaseModule {}
