import { IHashComparer } from '@/domain/usecases/contracts/cryptography/hash-compare';
import { IHashGenerator } from '@/domain/usecases/contracts/cryptography/hash-generator';

export class FakeHasher implements IHashGenerator, IHashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash === (await this.hash(plain));
  }
}
