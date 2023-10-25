import { Module } from '@nestjs/common';
import { BcryptHasher } from './cryptography/bcrypt-hasher';

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
