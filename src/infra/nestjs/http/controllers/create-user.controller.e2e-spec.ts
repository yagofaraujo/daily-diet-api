import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/nestjs/modules/app.module';
import { DatabaseModule } from '@/infra/nestjs/modules/database.module';
import { UserFactory } from '@/test/factories/make-user';

describe('Create User (E2E)', async () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  it('[POST] /users', async () => {
    const user = await userFactory.makePrismaUser();

    console.log(user);
  });
});
