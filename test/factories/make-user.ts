import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id';
import { User, UserProps } from '@/domain/entities/User';

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId) {
  const user = User.create(
    {
      name: 'Fake User',
      email: 'fake@user.com',
      password: '123456',
      ...override,
    },
    id,
  );

  return user;
}
