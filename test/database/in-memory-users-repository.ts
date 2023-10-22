import { User } from '@/domain/entities/User';
import { IUsersRepository } from '@/domain/usecases/ports/users-repository';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
}
