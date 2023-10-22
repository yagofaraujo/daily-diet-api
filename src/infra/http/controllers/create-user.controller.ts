import { CreateUserUseCase } from '@/domain/usecases/create-user';
import { StudentAlreadyExistsError } from '@/domain/usecases/errors/student-already-exists-error';
import { Body, ConflictException, Controller, Get, HttpCode, InternalServerErrorException, Post } from '@nestjs/common';

@Controller('/users')
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Get()
  async test() {
    return 'oi';
  }

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
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new InternalServerErrorException('Unexpected Error');
      }
    }
  }
}
