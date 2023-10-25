import { User } from '@/domain/entities/User';

/*
  OUTRA MANEIRA DE FAZER INVERSÃO DE DEPENDÊNCIA:
    * Transformando interface em classe abstrata
    * Dessa forma, ela poderá ser injetada sem precisar usar o "useFactory" do NestJS
      * Como feito com o "MealsRepository" que está em /src/infra/database/database.module.ts   
    * Dessa forma, como classe, será possível aplicar o @Injectable(),
      então o Nest consegue fazer isso automaticamente "por baixo dos panos".
    * Quando o contrato é uma interface, a partir do momento que o código TS é transformado em JS,
      a interface "some", então o Nest não consegue mais aplicar o @Injectable(). Desta forma,
      temos que criar a "factory" e fazer a injeção de dependência manualmente
  

  // Exemplo:
  export abstract class IUsersRepository {
    abstract create(user: User): Promise<void>;
    abstract findByEmail(email: string): Promise<User | null>;
  }
*/

export interface IUsersRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
