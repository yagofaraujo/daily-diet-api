import { User } from '@/domain/entities/User';
import { IUsersRepository } from '@/domain/usecases/contracts/repositories/users-repository';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const usuario = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      return null;
    }

    return PrismaUserMapper.toDomain(usuario);
  }
}
