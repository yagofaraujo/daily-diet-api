import { User } from '@/domain/entities/User';
import { IUsersRepository } from '@/domain/usecases/ports/users-repository';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }
}
