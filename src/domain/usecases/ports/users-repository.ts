import { User } from '@/domain/entities/User';

export interface IUsersRepository {
  create(user: User): Promise<void>;
}
