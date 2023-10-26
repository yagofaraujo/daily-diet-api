import { UseCaseError } from '../../../core/errors/use-case-error';

export class InvalidUploadFileTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`);
  }
}
