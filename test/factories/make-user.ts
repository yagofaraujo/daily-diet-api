import { UniqueEntityId } from '@/domain/core/entities/value-objects/unique-entity-id';
import { User, UserProps } from '@/domain/entities/User';

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId) {
  const user = User.create(
    {
      name: 'Fake User',
      email: 'fake@user.com',
      ...override,
    },
    id,
  );

  return user;
}
