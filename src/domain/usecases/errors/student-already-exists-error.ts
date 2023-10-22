import { UseCaseError } from '@/core/errors/use-case-error';

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User with e-mail "${identifier}" already exists.`);
  }
}
