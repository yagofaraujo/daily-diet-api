import { CreateUserUseCase } from '@/domain/usecases/create-user';
import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';

@Controller('/users')
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body;
    const result = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case value:
          throw new ConflictException(error.message);
        default:
          throw new InternalServerErrorException('Unexpected Error');
      }
    }
  }
}
