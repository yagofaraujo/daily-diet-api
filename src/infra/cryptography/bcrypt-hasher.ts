import { IHashGenerator } from '@/domain/usecases/ports/cryptography/hash-generator';
import { hash } from 'bcryptjs';

export class BcryptHasher implements IHashGenerator {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }
}
