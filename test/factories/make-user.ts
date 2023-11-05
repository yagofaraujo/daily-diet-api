import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id';
import { User, UserProps } from '@/domain/entities/User';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
