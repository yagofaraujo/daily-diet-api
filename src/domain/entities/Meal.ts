import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface MealProps {
  userId: UniqueEntityId;
  name: string;
  description: string;
  date: Date;
  isOnUserDiet: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Meal extends Entity<MealProps> {
  private touch() {
    this.props.updatedAt = new Date();
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  get date() {
    return this.props.date;
  }

  set date(date: Date) {
    this.props.date = date;
    this.touch();
  }

  get isOnUserDiet() {
    return this.props.isOnUserDiet;
  }

  set isOnUserDiet(isOnUserDiet: boolean) {
    this.props.isOnUserDiet = isOnUserDiet;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<MealProps, 'createdAt'>, id?: UniqueEntityId) {
    const meal = new Meal(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return meal;
  }
}
