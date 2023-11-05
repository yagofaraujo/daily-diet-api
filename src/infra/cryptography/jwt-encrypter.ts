import { IEncrypter } from '@/domain/usecases/contracts/cryptography/encrypter';
import { JwtService } from '@nestjs/jwt';

export class JwtEncrypter implements IEncrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
