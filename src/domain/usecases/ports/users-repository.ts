import { User } from '@/domain/entities/User';

export abstract class IUsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
}
