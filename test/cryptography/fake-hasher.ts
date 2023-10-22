import { IHashGenerator } from '@/domain/usecases/ports/cryptography/hash-generator';

export class FakeHasher implements IHashGenerator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }
}
