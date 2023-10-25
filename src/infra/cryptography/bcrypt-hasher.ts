import { IHashComparer } from '@/domain/usecases/contracts/cryptography/hash-compare';
import { IHashGenerator } from '@/domain/usecases/contracts/cryptography/hash-generator';
import { hash } from 'bcryptjs';

export class BcryptHasher implements IHashGenerator, IHashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await this.compare(plain, hash);
  }
}
