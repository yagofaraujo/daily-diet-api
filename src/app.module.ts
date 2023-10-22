import { Module } from '@nestjs/common';
import { AppController } from './infra/http/app.controller';
import { AppService } from './infra/http/app.service';
import { PrismaService } from './infra/prisma/prisma.service';
import { CreateUserController } from './infra/http/controllers/create-user.controller';

@Module({
  imports: [],
  controllers: [AppController, CreateUserController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
