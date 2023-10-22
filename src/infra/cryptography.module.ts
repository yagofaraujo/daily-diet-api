import { Module } from '@nestjs/common';
import { BcryptHasher } from './cryptography/bcrypt-hasher';
import { IHashGenerator } from '@/domain/usecases/ports/cryptography/hash-generator';

@Module({
  providers: [{ provide: IHashGenerator, useClass: BcryptHasher }],
  exports: [IHashGenerator],
})
export class CryptographyModule {}
