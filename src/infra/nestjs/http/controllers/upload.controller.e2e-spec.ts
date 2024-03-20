import { UserFactory } from '@/test/factories/make-user';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../modules/app.module';
import { DatabaseModule } from '../../modules/database.module';

describe('Upload files (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /uploads', async () => {
    const user = await userFactory.makePrismaUser();

    console.log('test');
    const accessToken = jwt.sign({ sub: user.id.toString() });
    console.log('sign');

    const response = await request(app.getHttpServer())
      .post('/uploads')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png');

    expect(response.statusCode).toBe(201);
  });
});
