import { Module } from '@nestjs/common';
import { BcryptHasher } from './cryptography/bcrypt-hasher';
import { JwtEncrypter } from './cryptography/jwt-encrypter';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    {
      provide: BcryptHasher,
      useFactory: () => new BcryptHasher(),
    },
    {
      provide: JwtEncrypter,
      useFactory: (jwtService: JwtService) => new JwtEncrypter(jwtService),
      inject: [JwtService],
    },
  ],
  exports: [BcryptHasher, JwtEncrypter],
})
export class CryptographyModule {}
