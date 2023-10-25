import { Module } from '@nestjs/common';
import { BcryptHasher } from './cryptography/bcrypt-hasher';
// import { IHashGenerator } from '@/domain/usecases/contracts/cryptography/hash-generator';

@Module({
  providers: [
    {
      provide: BcryptHasher,
      useFactory: () => new BcryptHasher(),
    },
  ],
  exports: [BcryptHasher],
})
export class CryptographyModule {}
